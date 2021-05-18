# install dependencies
 yarn

# build libraries
 yarn build:libs

# build apps
 yarn build:apps

# name: remove dev dependencies
 yarn strip:deps --dev --include-client --include-server

# build docker image
 sudo docker image build -t "${1:-cherryjuice}" .
