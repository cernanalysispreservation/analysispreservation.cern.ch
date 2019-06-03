# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM gitlab-registry.cern.ch/analysispreservation/base:python2-xrootd-go

RUN yum -y install kstart krb5-server krb5-libs krb5-devel krb5-workstation

# Install Invenio
ENV WORKING_DIR=/opt/cap
ENV INVENIO_INSTANCE_PATH=${WORKING_DIR}/var/instance

# Debug off by default
ARG DEBUG=False
ENV DEBUG=${DEBUG}

# copy everything inside /src
RUN mkdir -p ${WORKING_DIR}/src
COPY ./ ${WORKING_DIR}/src
WORKDIR ${WORKING_DIR}/src

ADD setup.py setup.py
ADD cap/version.py cap/version.py

RUN python -m site
RUN python -m site --user-site

# Install/create static files
RUN mkdir -p ${INVENIO_INSTANCE_PATH}

RUN pip install --upgrade setuptools wheel uwsgi uwsgitop uwsgi-tools
RUN pip install --upgrade pip==9.0.1

# RUN if [ "$DEBUG" = "True" ]; then pip install -r requirements-devel.txt; fi;
RUN pip install -r requirements-local-forks.txt
RUN pip install -r requirements.txt
RUN pip install -e .[all,xrootd]

# copy uwsgi config files
COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}

ARG APP_GITHUB_OAUTH_ACCESS_TOKEN
ENV APP_GITHUB_OAUTH_ACCESS_TOKEN=${APP_GITHUB_OAUTH_ACCESS_TOKEN}
ARG APP_GITLAB_OAUTH_ACCESS_TOKEN
ENV APP_GITLAB_OAUTH_ACCESS_TOKEN=${APP_GITLAB_OAUTH_ACCESS_TOKEN}

# Set folder permissions
RUN chgrp -R 0 ${WORKING_DIR} && \
    chmod -R g=u ${WORKING_DIR}

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root ${WORKING_DIR}
USER 1000
