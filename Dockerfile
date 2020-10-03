from node:12.13.0 as cs

workdir /temp
copy ./apps ./apps
copy ./libs ./libs
copy ./package.json ./package.json
copy ./yarn.lock ./yarn.lock

workdir /temp
run yarn

workdir /temp/apps/cs_client
run yarn build
workdir /temp/apps/cs_server
run yarn build

from node:12.13.0-slim
label maintainer ycnmhd
copy --from=cs temp/apps/cs_server/src apps/cs/server/src
copy --from=cs temp/apps/cs_server/migrations apps/cs/server/migrations
copy --from=cs temp/apps/cs_server/package.json apps/cs/server/package.json
copy --from=cs temp/apps/cs_server/tsconfig.json apps/cs/server/tsconfig.json
copy --from=cs temp/apps/cs_server/dist apps/cs/server/dist
copy --from=cs temp/apps/cs_server/node_modules apps/cs/server/node_modules
copy --from=cs temp/node_modules apps/cs/server/node_modules
copy --from=cs temp/apps/cs_client/dist apps/cs/client
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports

run echo "cd apps/cs/server/ && yarn start" > /entrypoint.sh
run chmod +x /entrypoint.sh

entrypoint ["/entrypoint.sh"]