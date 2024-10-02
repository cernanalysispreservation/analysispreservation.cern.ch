FROM node:18-alpine as build

RUN apk add --no-cache git

ENV WORKING_DIR=/tmp/cap

WORKDIR $WORKING_DIR

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

RUN mkdir -p ui/cap-react
RUN echo "PIWIK_URL=$CAP_PIWIK_URL" >> ui/cap-react/.env
RUN echo "ENABLE_E2E=$ENABLE_E2E" >> ui/cap-react/.env

RUN if [[ $PIWIK_ENV == "dev" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_DEV" >> ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "prod" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_PROD" >> ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "qa" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_QA" >> ui/cap-react/.env; \
    fi

RUN if [[ $PIWIK_ENV == "test" ]]; then \
        echo "PIWIK_SITEID=$CAP_PIWIK_SITEID_TEST" >> ui/cap-react/.env; \
    fi


RUN echo "=========================="
RUN echo $CAP_PIWIK_SITEID_TEST 
RUN echo $PIWIK_SITEID_TEST
RUN echo "=========================="
RUN cat ui/cap-react/.env
RUN echo "=========================="

WORKDIR $WORKING_DIR/ui

# build CAP UI
COPY ./ui ${WORKING_DIR}/ui
RUN yarn install
RUN yarn workspace cap-react build

# build general docs
COPY ./docs ${WORKING_DIR}/docs
WORKDIR $WORKING_DIR/docs
RUN yarn install
RUN yarn build

# build API docs
RUN git clone https://github.com/cernanalysispreservation/cap-api-docs.git $WORKING_DIR/cap-api-docs/
WORKDIR $WORKING_DIR/cap-api-docs
RUN npm install --maxsockets 1
RUN npm run build

# build client docs
RUN git clone https://github.com/cernanalysispreservation/cap-client.git $WORKING_DIR/cap-client/
WORKDIR $WORKING_DIR/cap-client/docs
RUN yarn install
RUN yarn build


FROM nginx:1.24

ENV WORKING_DIR=/tmp/cap
ENV NGINX_HTML_DIR=/usr/share/nginx/html/
RUN mkdir -p $NGINX_HTML_DIR

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build ${WORKING_DIR}/ui/cap-react/dist/ $NGINX_HTML_DIR
COPY --from=build ${WORKING_DIR}/docs/_book/ $NGINX_HTML_DIR/docs/general
COPY --from=build ${WORKING_DIR}/cap-api-docs/web_deploy/ $NGINX_HTML_DIR/docs/api
COPY --from=build ${WORKING_DIR}/cap-client/docs/_book/ $NGINX_HTML_DIR/docs/client
