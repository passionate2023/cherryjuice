cd bin
echo "DATABASE_URL=" > .env

mkdir -p cherryjuice-win
mv cherryjuice-win.exe cherryjuice-win
perl -p -e 's/\n/\r\n/' < .env > cherryjuice-win/.env
tar czvf cherryjuice-win.tar.gz cherryjuice-win

mv cherryjuice-linux cherryjuice-linux-bin
mkdir -p cherryjuice-linux
mv cherryjuice-linux-bin cherryjuice-linux/cherryjuice-linux
cp .env cherryjuice-linux
tar czvf cherryjuice-linux.tar.gz cherryjuice-linux
