FROM node:18 as client-builder

ENV WORKING_DIR=/tmp/cap
ENV NGINX_HTML_DIR=/usr/share/nginx/html
RUN mkdir -p $NGINX_HTML_DIR


RUN cp -rfp $WORKING_DIR/docker/nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR $WORKING_DIR/ui

RUN npm install --global yarn

ARG PIWIK_ENV=dev
ARG ENABLE_E2E

ARG CAP_PIWIK_URL
ARG CAP_PIWIK_SITEID_DEV
ARG CAP_PIWIK_SITEID_PROD
ARG CAP_PIWIK_SITEID_QA
ARG CAP_PIWIK_SITEID_TEST

ARG PIWIK_URL
ARG PIWIK_SITEID_DEV
ARG PIWIK_SITEID_PROD
ARG PIWIK_SITEID_QA
ARG PIWIK_SITEID_TEST

RUN echo "" >> $WORKING_DIR/ui/cap-react/.env
RUN echo "" >> $WORKING_DIR/ui/cap-react/.env
RUN echo "PIWIK_URL=$CAP_PIWIK_URL" >> $WORKING_DIR/ui/cap-react/.env
RUN echo "ENABLE_E2E=$ENABLE_E2E" >> $WORKING_DIR/ui/cap-react/.env

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN if [[ $PIWIK_ENV == "dev" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_DEV" >> $WORKING_DIR/ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "prod" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_PROD" >> $WORKING_DIR/ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "qa" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_QA" >> $WORKING_DIR/ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "test" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_TEST" >> $WORKING_DIR/ui/cap-react/.env; \
    fi

RUN echo "=========================="
RUN echo $CAP_PIWIK_SITEID_TEST 
RUN echo $PIWIK_SITEID_TEST
RUN echo "=========================="
RUN less $WORKING_DIR/ui/cap-react/.env
RUN echo "=========================="

COPY ./ui/package.json ${APP_UI}
RUN yarn install
COPY ./ui ${APP_UI}

RUN yarn workspace cap-react build

RUN cp -rfp ./cap-react/dist/* $NGINX_HTML_DIR

# # build docs general
# WORKDIR $WORKING_DIR/docs

# RUN yarn install
# RUN yarn build

# RUN mkdir -p $NGINX_HTML_DIR/docs/general
# RUN cp -rfp ./_book/* $NGINX_HTML_DIR/docs/general


# # build docs API
# RUN git clone https://github.com/cernanalysispreservation/cap-api-docs.git $WORKING_DIR/cap-api-docs/
# WORKDIR $WORKING_DIR/cap-api-docs

# RUN npm install --maxsockets 1
# RUN npm run build

# RUN mkdir -p $NGINX_HTML_DIR/docs/api
# RUN cp -rfp ./web_deploy/* $NGINX_HTML_DIR/docs/api


# # build docs client
# RUN git clone https://github.com/cernanalysispreservation/cap-client.git $WORKING_DIR/cap-client/
# WORKDIR $WORKING_DIR/cap-client/docs

# RUN yarn
# RUN yarn build

# RUN mkdir -p $NGINX_HTML_DIR/docs/client
# RUN cp -rfp ./_book/* $NGINX_HTML_DIR/docs/client
