cd bin
echo "DATABASE_URL=" > .env

mv cherryjuice-win.exe cherryjuice-win
perl -p -e 's/\n/\r\n/' < .env > cherryjuice-win/.env
cp ../LICENSE cherryjuice-win
tar czvf cherryjuice-win.tar.gz cherryjuice-win

mv cherryjuice-linux cherryjuice-linux-bin/cherryjuice-linux
mv cherryjuice-linux-bin cherryjuice-linux
cp .env cherryjuice-linux
cp ../LICENSE cherryjuice-linux
tar czvf cherryjuice-linux.tar.gz cherryjuice-linux
