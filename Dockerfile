from node:12.13.0 as cs


workdir /temp
copy ./apps ./apps
copy ./libs ./libs
copy ./scripts ./scripts
copy ./package.json ./package.json
copy ./yarn.lock ./yarn.lock

workdir /temp
run yarn
run yarn build:libs
run yarn build:apps
run yarn strip:deps
from node:12.13.0-slim
label maintainer ycnmhd

#copy server assets
copy --from=cs temp/apps/cs_server/package.json build/apps/server/package.json
copy --from=cs temp/apps/cs_server/tsconfig.json build/apps/server/tsconfig.json
copy --from=cs temp/apps/cs_server/migrations build/apps/server/migrations
copy --from=cs temp/apps/cs_server/src build/apps/server/src
copy --from=cs temp/apps/cs_server/dist build/apps/server/dist

copy --from=cs temp/apps/cs_client/dist build/apps/client
copy --from=cs temp/libs/ build/libs
copy --from=cs temp/package.json/ build/package.json
copy --from=cs temp/yarn.lock build/yarn.lock

workdir /build/apps/server
run yarn install

workdir /
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports
run echo "cd build/apps/server/ && yarn start" > /entrypoint.sh
run chmod +x /entrypoint.sh

entrypoint ["/entrypoint.sh"]