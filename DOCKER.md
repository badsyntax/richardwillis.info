# Docker

## Running the Stack With Docker Swarm

```console
docker swarm init
docker network create --driver=overlay traefik-public
docker stack rm $(docker stack ls --format "{{.Name}}")

printf "postgres-password" | docker secret create richardwillis-postgres-password -
printf "postgres-user" | docker secret create richardwillis-postgres-user -
printf "DATABASE_HOST=strapi_db
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres-user
DATABASE_PASSWORD=postgres-password
ADMIN_JWT_SECRET=123456789

AWS_ACCESS_KEY_ID=123456
AWS_ACCESS_SECRET=123456
AWS_REGION=us-east-1
AWS_BUCKET=assets.example.com" | docker secret create richardwillis-strapi-config -

printf "GITHUB_TOKEN=1234" | docker secret create richardwillis-actions-proxy-env -

printf "GITHUB_TOKEN=1234" | docker secret create richardwillis-actions-proxy-env -

ADMIN_USER_EMAIL=replace-me
ADMIN_USER_NAME=replace-me
ADMIN_USER_PWD=replace-me
BASE_URL=replace-me
SECRET_KEY_BASE=replace-me



printf "plausible-admin-user-email" | docker secret create richardwillis-plausible-admin-user-email -
printf "plausible-admin-user-name" | docker secret create richardwillis-plausible-admin-user-name -
printf "plausible-admin-user-password" | docker secret create richardwillis-plausible-admin-user-password -
printf "plausible-base-url" | docker secret create richardwillis-plausible-base-url -
printf "plausible-secret-key-base" | docker secret create richardwillis-plausible-secret-key-base -

docker stack deploy --compose-file docker-compose.yml richardwillis
docker service update richardwillis_nextjs --publish-add 3002:80
docker service update richardwillis_plausible --publish-add 8001:8000

docker service ls
```
