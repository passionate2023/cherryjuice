from node:12.2.0 as cs
workdir /server
copy ./cs_server/ .
run yarn install
run yarn link:ahtml-to-html

workdir /client
copy ./cs_client/ .
run yarn install --ignore-optional

workdir /client
run yarn build
workdir /server
run yarn build

from node:12.2.0-slim
label maintainer ycnmhd
copy --from=cs /server/dist /cs/server
copy --from=cs /server/node_modules /cs/server/node_modules
copy --from=cs /client/dist /cs/client
run mkdir -p /.cs/exports
run mkdir -p /.cs/imports

entrypoint ["node","./cs/server/main.js"]
