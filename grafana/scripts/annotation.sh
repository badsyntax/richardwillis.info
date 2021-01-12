#!/usr/bin/env bash

curl -XPOST https://grafana.dokku.proxima-web.com/api/auth/keys \
  -H "Content-Type: application/json" \
  --user "admin:admin" \
  --data @- << EOF
  {
    "name": "Deployment Annotations",
    "role": "Editor"
  }
EOF

curl -XGET https://grafana.dokku.proxima-web.com/api/dashboards/uid/FxNQj9bGk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GRAFANA_AUTH_TOKEN" \
  | jq '.dashboard.id'

# Won't work on MacOs
# timeend=$(date +%s%N | cut -b1-13)
timeend=1610400076807

curl -XPOST https://grafana.dokku.proxima-web.com/api/annotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GRAFANA_AUTH_TOKEN" \
  --data @- <<EOF
  {
    "dashboardId":2,
    "panelId":1,
    "time":1610398711217,
    "timeEnd":$timeend,
    "tags":["deployment","production"],
    "text":"Annotation Description"
  }
EOF
