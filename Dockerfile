FROM ycnmhd/nginx-node:12.13.0 as cs


WORKDIR /temp
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./scripts ./scripts
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

WORKDIR /temp
RUN yarn
RUN yarn build:libs
RUN yarn build:apps
RUN yarn strip:deps

FROM ycnmhd/nginx-node:12.13.0
LABEL maintainer=ycnmhd

COPY nginx/cj.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=cs temp/apps/cs_client/dist /usr/share/nginx/html

#copy server assets
COPY --from=cs temp/apps/cs_server/package.json /usr/share/cj/apps/server/package.json
COPY --from=cs temp/apps/cs_server/tsconfig.json /usr/share/cj/apps/server/tsconfig.json
COPY --from=cs temp/apps/cs_server/migrations /usr/share/cj/apps/server/migrations
COPY --from=cs temp/apps/cs_server/src /usr/share/cj/apps/server/src
COPY --from=cs temp/apps/cs_server/dist /usr/share/cj/apps/server/dist

COPY --from=cs temp/libs/ /usr/share/cj/libs
COPY --from=cs temp/package.json/ /usr/share/cj/package.json
COPY --from=cs temp/yarn.lock /usr/share/cj/yarn.lock

WORKDIR /usr/share/cj/apps/server
RUN yarn install

WORKDIR /
RUN mkdir -p /.cs/exports
RUN mkdir -p /.cs/imports

COPY scripts /scripts
RUN ["chmod", "+x", "/scripts/entrypoint.sh"]
RUN ["chmod", "+x", "/scripts/nginx.sh"]
RUN ["chmod", "+x", "/scripts/node.sh"]
ENTRYPOINT ["/scripts/entrypoint.sh"]
