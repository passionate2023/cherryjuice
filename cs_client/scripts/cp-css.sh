sed -i "s/mode: 'development'/mode: 'production'/g" webpack/webpack.prod.js
find dist/ -type f -name "*css*" -exec cp {} temp/ \;