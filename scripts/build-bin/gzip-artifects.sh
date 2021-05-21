cd bin
echo "JWT_SECRET=SECRET\nJWT_EXPIRES_IN=30d\nNODE_PORT=3000\nNODE_SERVE_STATIC=true\nDATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE" > .env

mkdir -p cherryjuice-win
mv cherryjuice-win.exe cherryjuice-win
perl -p -e 's/\n/\r\n/' < .env > cherryjuice-win/.env
tar czvf cherryjuice-win.tar.gz cherryjuice-win

mv cherryjuice-linux cherryjuice-linux-bin
mkdir -p cherryjuice-linux
mv cherryjuice-linux-bin cherryjuice-linux/cherryjuice-linux
cp .env cherryjuice-linux
tar czvf cherryjuice-linux.tar.gz cherryjuice-linux
