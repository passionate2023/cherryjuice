#!/bin/sh
cd ../../..
node common/deploy/create-links.js create

cp -r common/autoinstallers/build-pkg/scripts common/deploy
cp -r common/autoinstallers/build-pkg/package.json common/deploy

mkdir -p common/deploy/apps/client 
cp -r apps/client/build common/deploy/apps/client 

cd common/autoinstallers/build-pkg
rimraf ../../deploy/bin
pkg --out-path=bin ../../deploy


