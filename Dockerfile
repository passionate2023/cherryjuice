from node:12.2.0 as cs

workdir /temp
copy ./apps/cs_server/ ./apps/cs_server
copy ./apps/cs_client/ ./apps/cs_client
copy ./libs/graphql-types/ ./libs/graphql-types
copy ./package.json ./package.json

workdir /temp/apps/cs_server
run yarn link:ahtml-to-html

workdir /temp/apps/cs_server
run yarn
run yarn build
workdir /temp/apps/cs_client
run yarn
run yarn build

from node:12.2.0-slim
label maintainer ycnmhd
copy --from=cs temp/apps/cs_server/src /cs/server/src
copy --from=cs temp/apps/cs_server/migrations /cs/server/migrations
copy --from=cs temp/apps/cs_server/package.json /cs/server/package.json
copy --from=cs temp/apps/cs_server/tsconfig.json /cs/server/tsconfig.json
copy --from=cs temp/apps/cs_server/dist /cs/server/dist
copy --from=cs temp/apps/cs_server/node_modules /cs/server/node_modules
copy --from=cs temp/apps/cs_client/dist /cs/client
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports

run echo "cd /cs/server/ && yarn start" > /entrypoint.sh
run chmod +x /entrypoint.sh

entrypoint ["/entrypoint.sh"]