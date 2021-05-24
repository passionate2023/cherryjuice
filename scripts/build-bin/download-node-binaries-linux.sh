download()
{
        mkdir -p $BIN_FOLDER && wget -qO-  $BIN_URL | tar -C $BIN_FOLDER -zxvf -
}

mkdir -p bin/cherryjuice-linux-bin
cd bin/cherryjuice-linux-bin

BIN_FOLDER=bcrypt/lib/binding
BIN_URL=https://github.com/kelektiv/node.bcrypt.js/releases/download/v4.0.0/bcrypt_lib-v4.0.0-napi-v3-linux-x64-glibc.tar.gz
download

BIN_FOLDER=sharp
BIN_URL=https://github.com/lovell/sharp/releases/download/v0.25.4/sharp-v0.25.4-node-v83-linux-x64.tar.gz
download

BIN_FOLDER=sharp/vendor
BIN_URL=https://github.com/lovell/sharp-libvips/releases/download/v8.9.0/libvips-8.9.0-linux-x64.tar.gz
download

BIN_FOLDER=sqlite3/lib/binding
BIN_URL=https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v5.0.2/napi-v3-linux-x64.tar.gz
download
