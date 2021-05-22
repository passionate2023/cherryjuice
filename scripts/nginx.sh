#!/bin/bash
envsubst '\$PORT \$NODE_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
nginx 
