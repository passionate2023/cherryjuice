FROM ycnmhd/nginx-node:14.15.3
LABEL maintainer=ycnmhd

# entrypoint
COPY scripts /scripts

# nginx
COPY nginx/cj.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/shared/ /etc/nginx/shared

# server code and dependencies
COPY apps/server /usr/share/cj/apps/server
COPY common /usr/share/cj/common
COPY libs /usr/share/cj/libs
COPY create-links.js /usr/share/cj
COPY deploy-metadata.json /usr/share/cj
RUN node /usr/share/cj/create-links.js create

# client code
COPY ./apps/client/build /usr/share/nginx/html

ENV PORT=4000
ENV NODE_PORT=3000
ENV NODE_SERVE_STATIC=false

ENTRYPOINT ["/scripts/entrypoint.sh"]
