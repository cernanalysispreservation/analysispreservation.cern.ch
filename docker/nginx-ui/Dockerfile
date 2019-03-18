FROM exiasr/alpine-yarn-nginx

ENV WORKING_DIR=/tmp/cap
ENV WWW_DIR=/www

RUN apk update
RUN apk add git yarn python g++ make && rm -rf /var/cache/apk/*

# We invalidate cache always because there is no easy way for now to detect
# if something in the whole git repo changed. For docker git clone <url> <dir>
# is always the same so it caches it.
ARG CACHE_DATE=not_a_date

# get the code at a specific commit
RUN git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git $WORKING_DIR/

WORKDIR $WORKING_DIR

# check if one of the argument is passed to checkout the repo on a specific commit, otherwise use the latest
ARG BRANCH_NAME=master
ARG COMMIT_ID
ARG TAG_NAME
ARG PR_ID

RUN echo "BRANCH_NAME:" $BRANCH_NAME
RUN echo "COMMIT_ID:" $COMMIT_ID
RUN echo "TAG_NAME:" $TAG_NAME
RUN echo "PR_ID:" $PR_ID

RUN if [ ! -z $BRANCH_NAME ]; then \
        # run commands to checkout a branch
        echo "Checkout branch $BRANCH_NAME" && \
        git checkout $BRANCH_NAME; \
    elif [ ! -z $COMMIT_ID ]; then \
        # run commands to checkout a commit
        echo "Checkout commit $COMMIT_ID" && \
        git checkout $COMMIT_ID; \
    elif [ ! -z $TAG_NAME ]; then \
        # run commands to checkout a tag
        echo "Checkout tag $TAG_NAME" && \
        git checkout tags/$TAG_NAME; \
    elif [ ! -z $PR_ID ]; then \
        # run commands to checkout a pr
        echo "Checkout PR #$PR_ID" && \
        git fetch origin pull/$PR_ID/head:$PR_ID && \
        git checkout $PR_ID; \
    fi


## print current commit id
RUN echo "Current commit id:" && git rev-parse HEAD

RUN cp -rfp $WORKING_DIR/docker/nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR $WORKING_DIR/ui

RUN yarn config set cache ~/.my-yarn-cache-dir
RUN yarn install
RUN yarn build

RUN mkdir -p /usr/share/nginx/html
RUN cp -rfp ./dist/* /usr/share/nginx/html