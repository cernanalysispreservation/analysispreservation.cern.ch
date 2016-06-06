# This file is part of CERN Analysis Preservation.
# Copyright (C) 2016 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Invenio; if not, write to the Free Software Foundation, Inc.,
# 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.


FROM python:2.7

# Install dependencies
RUN apt-get update \
    && apt-get -qy upgrade --fix-missing --no-install-recommends \
    # Node.js
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -qy install --fix-missing --no-install-recommends \
        nodejs \
    && apt-get clean autoclean

RUN npm install --silent -g node-sass clean-css uglify-js requirejs

WORKDIR /code/

COPY . /code/

RUN pip install -r requirements.txt \
    && pip install -e .[all]

RUN echo '{ "allow_root": true }' > /root/.bowerrc \
    && cap npm \
    && cd /usr/local/var/cap-instance/static/ \
    && npm install bower \
    && npm install \
    && cd - \
    && cd /usr/local/var/cap-instance/static/node_modules/alpaca \
    && npm install gulp gulp-clean gulp-nodemon jshint gulp-jshint \
    && npm install \
    && npm start \
    && cd - \
    && cap collect -v \
    && cap assets build

CMD ["cap", "run", "-h", "0.0.0.0"]