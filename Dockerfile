FROM ycnmhd/nginx-node:14.15.3
LABEL maintainer=ycnmhd

# entrypoint
RUN mkdir -p /.cs/exports
RUN mkdir -p /.cs/imports

COPY scripts /scripts
RUN ["chmod", "+x", "/scripts/entrypoint.sh"]
RUN ["chmod", "+x", "/scripts/nginx.sh"]
RUN ["chmod", "+x", "/scripts/node.sh"]

# nginx
COPY nginx/cj.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# server runtime dependencies
COPY ./libs/ /usr/share/cj/libs
COPY ./node_modules/@cherryjuice /usr/share/cj/node_modules/@cherryjuice
COPY ./package.json/ /usr/share/cj/package.json
COPY ./yarn.lock /usr/share/cj/yarn.lock
COPY ./apps/cs_server/package.json /usr/share/cj/apps/server/package.json
COPY ./apps/cs_server/node_modules /usr/share/cj/apps/server/node_modules
WORKDIR /usr/share/cj/apps/server
RUN yarn install

# server code
COPY ./apps/cs_server/tsconfig.json /usr/share/cj/apps/server/tsconfig.json
COPY ./apps/cs_server/migrations /usr/share/cj/apps/server/migrations
COPY ./apps/cs_server/src /usr/share/cj/apps/server/src
COPY ./apps/cs_server/dist /usr/share/cj/apps/server/dist

# client code
COPY ./apps/cs_client/dist /usr/share/nginx/html

ENTRYPOINT ["/scripts/entrypoint.sh"]
