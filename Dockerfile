FROM ycnmhd/nginx-node:14.15.3
LABEL maintainer=ycnmhd

# entrypoint
COPY scripts /scripts

# nginx
COPY nginx/cj.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/shared/ /etc/nginx/shared

# server runtime dependencies
COPY ./libs/ /usr/share/cj/libs
COPY ./node_modules/@cherryjuice /usr/share/cj/node_modules/@cherryjuice
COPY ./package.json/ /usr/share/cj/package.json
COPY ./yarn.lock /usr/share/cj/yarn.lock
COPY ./apps/server/package.json /usr/share/cj/apps/server/package.json
COPY ./apps/server/node_modules /usr/share/cj/apps/server/node_modules
WORKDIR /usr/share/cj/apps/server
RUN yarn install

# server code
COPY ./apps/server/dist /usr/share/cj/apps/server/dist

# client code
COPY ./apps/client/dist /usr/share/nginx/html

ENV PORT=4000
ENV NODE_PORT=3000
ENV NODE_SERVE_STATIC=false

ENTRYPOINT ["/scripts/entrypoint.sh"]
