# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# CERN Analysis Preservation is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

FROM exiasr/alpine-yarn-nginx

ENV DEBUG=False
ENV WORKING_DIR=/code
ENV WWW_DIR=/www

RUN apk update
RUN apk add git yarn python g++ make && rm -rf /var/cache/apk/*

# We invalidate cache always because there is no easy way for now to detect
# if something in the whole git repo changed. For docker git clone <url> <dir>
# is always the same so it caches it.

ADD ./ /docs

RUN git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch $WORKING_DIR/

# If DEBUG mode, run form local branch, else copy repo fetch from Github
RUN if [ "$DEBUG" = "False" ]; then cp -rf ${WORKING_DIR}/docs /docs; fi;

WORKDIR /docs

ENV GITBOOK_CLI_VERSION="2.3.2"

# install GitBook CLI
RUN yarn global add gitbook-cli

RUN gitbook install

RUN pwd && ls && gitbook build

RUN cp -rf ./_book /var/www
RUN cp -rf ./docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
