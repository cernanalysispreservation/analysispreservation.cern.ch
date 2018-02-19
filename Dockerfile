# -*- coding: utf-8 -*-
#
# This file is part of CERN Analysis Preservation Framework.
# Copyright (C) 2016, 2017, 2018 CERN.
#
# CERN Analysis Preservation Framework is free software; you can redistribute
# it and/or modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# CERN Analysis Preservation Framework is distributed in the hope that it will
# be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with CERN Analysis Preservation Framework; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
# MA 02111-1307, USA.
#
# In applying this license, CERN does not
# waive the privileges and immunities granted to it by virtue of its status
# as an Intergovernmental Organization or submit itself to any jurisdiction.

# Use CentOS7:
FROM centos:7

# Install CERN Open Data Portal web node pre-requisites:
RUN yum update -y && \
    yum install -y \
        curl \
        git \
        rlwrap \
        screen \
        vim \
        emacs-nox && \
    yum install -y \
        epel-release && \
    yum groupinstall -y "Development Tools" && \
    yum install -y \
        libffi-devel \
        libxml2-devel \
        libxslt-devel \
        npm \
        python-devel \
        python-pip \
        openldap-devel

# Install xrootd
RUN rpm -Uvh http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

RUN yum install -y xrootd xrootd-server xrootd-client xrootd-client-devel xrootd-python

# Print xrootd version
RUN xrootd -v

# Clean after ourselves:
RUN yum clean -y all

ENV APP_INSTANCE_PATH=/usr/local/var/cap-instance

RUN pip install --upgrade pip setuptools wheel && \
    npm install -g node-sass@3.8.0 clean-css@3.4.24 requirejs uglify-js

# Install python modules and deps
WORKDIR /code
ADD setup.py setup.py
ADD cap/version.py cap/version.py
ADD requirements.txt requirements.txt

# Debug off by default
ARG DEBUG=False
ENV DEBUG=${DEBUG}

RUN if [ "$DEBUG" != "True" ]; then pip install -r requirements.txt; fi;
RUN pip install .[all]

ADD requirements-devel.txt requirements-devel.txt

# Install Python packages needed for development
RUN if [ "$DEBUG" = "True" ]; then pip install -e .[all]; pip install -e.[xrootd]; pip install -r requirements-devel.txt; fi;

# Add CAP sources to `code` and work there:
WORKDIR /code
ADD . /code

RUN adduser --uid 1000 cap --gid 0 && \
    chown -R cap:root /code

RUN bash /code/scripts/build-assets.sh
RUN chown -R cap:root /usr/local/var/cap-instance

USER 1000

CMD ["cap", "run", "-h", "0.0.0.0"]