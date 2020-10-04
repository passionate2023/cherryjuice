from node:12.13.0 as cs


workdir /temp
copy ./apps ./apps
copy ./libs ./libs
copy ./package.json ./package.json
copy ./yarn.lock ./yarn.lock

workdir /temp
run yarn
run yarn build:libs
run yarn build:apps

from node:12.13.0-slim
label maintainer ycnmhd
copy --from=cs temp/apps/cs_server/package.json apps/cs/server/full.package.json
copy --from=cs temp/apps/cs_server/tsconfig.json apps/cs/server/tsconfig.json
copy --from=cs temp/apps/cs_server/migrations apps/cs/server/migrations
copy --from=cs temp/apps/cs_server/src apps/cs/server/src
copy --from=cs temp/apps/cs_server/dist apps/cs/server/dist
copy --from=cs temp/apps/cs_client/dist apps/cs/client
workdir apps/cs/server
run awk '/},/ { p = 0 } { if (!p) { print $0 } } /"devDependencies":/ { p = 1 }' full.package.json > no-dev.package.json
run awk '/},/ { p = 0 } { if (!p) { print $0 } } /"optionalDependencies":/ { p = 1 }' no-dev.package.json > package.json
run yarn
copy --from=cs temp/node_modules/@cherryjuice apps/cs/server/node_modules/@cherryjuice
workdir /
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports

run echo "cd apps/cs/server/ && yarn start" > /entrypoint.sh
run chmod +x /entrypoint.sh

entrypoint ["/entrypoint.sh"]