#!/usr/bin/env sh

# Generation of NPM assets based on the bundle.py files of the project.
'{ "allow_root": true }' > /root/.bowerrc
cap npm
cd /usr/local/var/cap-instance/static/
npm install
cd /usr/local/var/cap-instance/static/node_modules/

# Manual installation of Alpaca since the NPM version is not working.
rm -rf alpaca
wget https://github.com/gitana/alpaca/archive/1.5.17.tar.gz
tar -xvf 1.5.17.tar.gz
mv alpaca-1.5.17/ alpaca
cd alpaca
npm install
npm start
cd /code

# Build assets.
cap collect -v
cap assets build
