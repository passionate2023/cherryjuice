download()
{
        mkdir -p $BIN_FOLDER && wget -qO-  $BIN_URL | tar -C $BIN_FOLDER -zxvf -
}

mkdir -p bin/cherryjuice-win
cd bin/cherryjuice-win

BIN_FOLDER=bcrypt/lib/binding
BIN_URL=https://github.com/kelektiv/node.bcrypt.js/releases/download/v4.0.0/bcrypt_lib-v4.0.0-napi-v3-win32-x64-unknown.tar.gz
download

BIN_FOLDER=sqlite3/lib/binding
BIN_URL=https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.2/napi-v3-win32-x64.tar.gz
download

BIN_FOLDER=sharp
BIN_URL=https://github.com/lovell/sharp/releases/download/v0.25.4/sharp-v0.25.4-node-v83-win32-x64.tar.gz
download

BIN_FOLDER=sharp/build/Release/temp
BIN_URL=https://github.com/lovell/sharp-libvips/releases/download/v8.9.0/libvips-8.9.0-win32-x64.tar.gz
download
mv sharp/build/Release/temp/lib/*.dll sharp/build/Release/
rm -rf sharp/build/Release/temp