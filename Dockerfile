from node:12.2.0 as cs
workdir /server
copy ./cs_server/ .
run yarn link:ahtml-to-html

workdir /client
copy ./cs_client/ .
run yarn install --ignore-optional

workdir /server
run yarn install

workdir /client
run yarn build
workdir /server
run yarn build

from node:12.2.0-slim
label maintainer ycnmhd
copy --from=cs /server/node_modules /cs/server/node_modules
copy --from=cs /server/dist /cs/server/dist
copy --from=cs /server/package.json /cs/server/package.json
copy --from=cs /server/tsconfig.json /cs/server/tsconfig.json
copy --from=cs /server/src /cs/server/src
copy --from=cs /server/migrations /cs/server/migrations
copy --from=cs /client/dist /cs/client
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports

run echo "cd /cs/server/ && yarn start" > /entrypoint.sh
run chmod +x /entrypoint.sh

entrypoint ["/entrypoint.sh"]