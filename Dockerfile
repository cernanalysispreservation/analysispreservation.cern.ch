# -*- coding: utf-8 -*-
#
# Copyright (C) 2023 CERN.
#
# Base cap image to install on with base python 3.10

# Todo: Change Platform and Image name
FROM  --platform=linux/arm64 cap-base:latest

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

RUN pip install -e .

# Copy uwsgi config files
COPY ./docker/uwsgi/ ${INVENIO_INSTANCE_PATH}

ARG APP_GITHUB_OAUTH_ACCESS_TOKEN
ENV APP_GITHUB_OAUTH_ACCESS_TOKEN=${APP_GITHUB_OAUTH_ACCESS_TOKEN}
ARG APP_GITLAB_OAUTH_ACCESS_TOKEN
ENV APP_GITLAB_OAUTH_ACCESS_TOKEN=${APP_GITLAB_OAUTH_ACCESS_TOKEN}

RUN pip install gunicorn

# Set folder permissions
RUN chgrp -R 0 ${WORKING_DIR} && \
    chmod -R g=u ${WORKING_DIR}

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root ${WORKING_DIR}
USER 1000
