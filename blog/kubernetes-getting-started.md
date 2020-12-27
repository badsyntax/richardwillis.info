---
title: 'Getting started with Kubernetes'
excerpt: 'Some semi-random notes about getting up and running with kubernetes'
date: '2020-03-16T05:35:07.322Z'
author:
  name: Richard Willis
  picture: '/assets/blog/authors/richard.jpg'
ogImage:
  url: '/assets/blog/hello-world/cover.jpg'
draft: true
---

Some semi-random notes about getting up and running with kubernetes, covering the following topics:

- kubernetes installation
- deploy app with Dockerfile
- setup load balancer/proxy to port proxy domains/hosts to running containers

Supporting Resources

- https://kubernetes.io/docs/tutorials/kubernetes-basics/

## Installing Kubernetes in production

We'll use one cloud server for the master node and one slightly beefier cloud server for a worker node.

1. Create a CPX11 server (2 VCPU / 2GB RAM) with a private network for the master node
2. Create a CX12 server (2 VCPU / 2GB RAM) for the worker node, and attach to the private network you created in step 1

I created the private network using the default settings (IP range 10.0.0.0).

Add DNS A records to point to the two different servers, eg:

- k8s-master.example.com
- k8s-worker-1.example.com

### Kubernetes Overview

Kubernetes uses resource files to manage the cluster. Resources are created or deleted with `kubectl`, for example:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
```

### Set up Master node (control-plane)

```bash
# ssh into master server
ssh root@k8s-master.example.com

# update root password
passwd

# update system packages
apt-get update
apt-get upgrade -y

# setup docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
apt-get update
apt-get install -y containerd.io docker-ce-cli docker-ce

# Set up the Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
mkdir -p /etc/systemd/system/docker.service.d
systemctl daemon-reload
systemctl restart docker
systemctl enable docker

# setup kubernetes
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubelet kubeadm kubectl

# init the cluster (pod-network-cidr is required for the flannel post network)
kubeadm init --apiserver-advertise-address PUBLIC_IP_ADDRESS --pod-network-cidr=10.244.0.0/16
```

Take note of the join commands in the output.

Now setup kubectl:

```bash
# for root
export KUBECONFIG=/etc/kubernetes/admin.conf
echo "KUBECONFIG=/etc/kubernetes/admin.conf" >> /etc/environment

# optionally add a user (aparently better to not use root)
adduser username
usermod -aG sudo username
su - username
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# verify master is not in a ready state
kubectl get nodes
```

Install the flannel pod network:

```bash
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# verify master is ready
kubectl get nodes
```

### Set up Worker Node

```bash
# ssh into master server
ssh root@k8s-worker-1.example.com

# update root password
passwd

# update system packages
apt-get update
apt-get upgrade -y

# setup docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
apt-get update
apt-get install -y containerd.io docker-ce-cli docker-ce

# Set up the Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
mkdir -p /etc/systemd/system/docker.service.d
systemctl daemon-reload
systemctl restart docker
systemctl enable docker

# setup kubernetes
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubelet kubeadm kubectl

# join the cluster (using command from master)
# eg kubeadm join 1.2.3.4.5:6443 --token 12345.123456 --discovery-token-ca-cert-hash sha256:123456
```

In your master node:

```bash
kubectl get nodes

# optionally label the worker node
kubectl label nodes <NODE_NAME> kubernetes.io/role=worker

# verify coredns, etcd & flannel pods are running
kubectl get pods --all-namespaces
```

### Set up local access

```bash
mkdir ~/.kube
scp root@k8s-master.example.com:/etc/kubernetes/admin.conf ~/.kube/config

# verify you can connect to the cluster
kubectl cluster-info
```

### Install the dashboard

On your desktop machine:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.5/aio/deploy/recommended.yaml
kubectl proxy
```

Now visit: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

TODO: dashboard access

### Install the nginx ingress controller

An ingress controller essentially allows external users to access containerized application using FQDN.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/deploy.yaml
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --watch
kubectl get service --namespace=ingress-nginx
```

Let's deploy an example app:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      run: nginx-deployment
  template:
    metadata:
      labels:
        run: nginx-deployment
    spec:
      containers:
        - image: nginx
          name: nginx-webserver

---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: NodePort
  selector:
    run: nginx-deployment
  ports:
    - port: 80

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
    - host: nginx-k8s.proxima-web.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx-service
                port:
                  number: 80
```

Now setup the resources:

```bash
kubectl create -f deploy.yaml
kubectl get deployments.apps nginx-deployment
kubectl get service nginx-service
kubectl get ingress nginx-ingress
kubectl describe ingress nginx-ingress
```

#### Supporting Resources

- https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui
- Authorizatoion docs: https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/README.md

### Supporting Resources

- https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/
- https://gist.github.com/rkaramandi/44c7cea91501e735ea99e356e9ae7883
- https://blog.sourcerer.io/a-kubernetes-quick-start-for-people-who-know-just-enough-about-docker-to-get-by-71c5933b4633

## Installing k3s in production

The following describes how to setup kubernetes (via k3s) and rancher on a single master node, on a clean Ubuntu 20.04 server (CX12 Hetzner server)

```bash
apt-get update
apt-get upgrade -y
curl -sfL https://get.k3s.io | sh -

# verify service is running
systemctl status k3s

# verify k3s config
cat /etc/rancher/k3s/k3s.yaml

# list nodes (wait for the master node to be ready)
kubectl get nodes

# list all resources
kubectl get all

# wait for k3s pods to be ready
kubectl get pods --all-namespaces

# verify cluster
kubectl cluster-info

# check running containers
crictl ps

# install helm
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

# set helm required env var
echo 'KUBECONFIG="/etc/rancher/k3s/k3s.yaml"' >> /etc/environment
source /etc/environment

# list helm charts
helm ls --all-namespaces

# install cert-manager (required by rancher)
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.0/cert-manager.yaml

# check deployment of cert-manager
kubectl --namespace cert-manager rollout status deploy/cert-manager
kubectl get pods --namespace cert-manager

# add helm chart repo
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable

# create namespace for rancher
kubectl create namespace cattle-system

# update local helm chart repository cache
helm repo update

# install rancher using letsencrypt for tls
helm install rancher rancher-stable/rancher \
  --namespace cattle-system \
  --set hostname=rancher.proxima-web.com \
  --set ingress.tls.source=letsEncrypt \
  --set letsEncrypt.email=willis.rh@gmail.com

# check rancher deploy status
kubectl --namespace cattle-system get deploy rancher

# wait for rancher to be rolled out
kubectl --namespace cattle-system rollout status deploy/rancher

# check ingress for rancher UI
kubectl --namespace cattle-system describe ingress
```

### Supporting Resources

- https://rancher.com/docs/rancher/v2.x/en/installation/install-rancher-on-k8s/

## Getting started with k3s

Install multipass (install docs) via homebrew

Create an Ubuntu VM with multipass:

```bash
brew cask install multipass
multipass launch --name k3s --cpus 4 --mem 4g --disk 20g
multipass info k3s
```

Add the VM IP to `/etc/hosts`:

```bash
❯ grep rancher /etc/hosts
192.168.64.3 rancher.localdev
```

Install kubectl on your host:

```bash
brew install kubernetes-cli helm
K3S_IP=$(multipass info k3s | grep IPv4 | awk '{print $2}')
echo $K3S_IP
multipass exec k3s sudo cat /etc/rancher/k3s/k3s.yaml > k3s.yaml
cat k3s.yaml
sed -i '' "s/127.0.0.1/${K3S_IP}/" k3s.yaml
export KUBECONFIG=${PWD}/k3s.yaml
kubectl get nodes
kubectl get all
kubectl get pods --all-namespaces
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.0/cert-manager.yaml
kubectl get pods --namespace cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager
helm repo add rancher-latest https://releases.rancher.com/server-charts/latest
helm repo update
kubectl create namespace cattle-system
helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --set hostname=rancher.localdev
kubectl -n cattle-system rollout status deploy/rancher
kubectl -n cattle-system get pods
kubectl -n cattle-system get ingresses
```

Visit https://rancher.localdev to view the Rancher UI.

> If using chrome, you can type `thisisunsafe` on the certificate error page to ignore the self signed certificate.

Supporting Resources

- https://jyeee.medium.com/kubernetes-on-your-macos-laptop-with-multipass-k3s-and-rancher-2-4-6e9cbf013f58

## Getting started with microk8s

The following assumes you're using MacOS.

Install microk8s:

```bash
brew install ubuntu/microk8s/microk8s
microk8s install
```

> Keep the multipass driver as `hyperkit`. (No IP address will be assigned with VirtualBox, so best to stick with hyperkit.) List the driver with `multipass set local.driver` and set the driver with `multipass set local.driver=kyperkit`

Deploy an app:

```bash
microk8s status --wait-ready
microk8s kubectl get all --all-namespaces
microk8s kubectl get nodes
microk8s kubectl get services
microk8s kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
microk8s kubectl get pods # monitor app deployment
# microk8s enable dns storage dashboard # install addons
```

### Supporting resources

- https://ubuntu.com/tutorials/install-microk8s-on-mac-os

### Accessing the dashboard

Enable the dashboard addon:

```bash
microk8s enable dashboard
```

Access the dashboard:

- (replace `microk8s-vm` with the VM name listed in `multipass list`)
- (you might need to wait a bit for the dashboard pod to become ready)

```bash
multipass exec microk8s-vm -- sudo /snap/bin/microk8s kubectl -n kube-system describe secret $(multipass exec microk8s-vm -- sudo /snap/bin/microk8s kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)
multipass exec microk8s-vm -- sudo /snap/bin/microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443 --address 0.0.0.0
```

### Supporting resources

- https://microk8s.io/docs/addon-dashboard
