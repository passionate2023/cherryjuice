from node as cs
workdir /server
copy ./cs_server/ .
run npm i -g parcel-bundler
run yarn install


workdir /client
copy ./cs_client/ .
run chmod +x scripts/patch-postcss-camel-case/copy.sh\
    && chmod +x scripts/cp-assets.sh
run yarn install --ignore-optional

workdir /client
run yarn build
workdir /server
run yarn build

from node:slim
label maintainer ycnmhd
copy --from=cs /server/dist /cs/server
copy --from=cs /server/node_modules /cs/server/node_modules
copy --from=cs /client/dist /cs/client
copy ./ctb-samples /cs/ctb-samples

entrypoint ["node","./cs/server/main.js"]
