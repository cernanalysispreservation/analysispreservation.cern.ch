# list of available base images here: https://gitlab.cern.ch/invenio/base
FROM gitlab-registry.cern.ch/analysispreservation/base:python2-xrootd-go

# uWSGI configuration to be changed
ARG UWSGI_WSGI_MODULE=invenio_app.wsgi_rest:application
ENV UWSGI_WSGI_MODULE ${UWSGI_WSGI_MODULE:-invenio_app.wsgi_rest:application}
ARG UWSGI_PORT=5000
ENV UWSGI_PORT ${UWSGI_PORT:-5000}
ARG UWSGI_PROCESSES=2
ENV UWSGI_PROCESSES ${UWSGI_PROCESSES:-2}
ARG UWSGI_THREADS=2
ENV UWSGI_THREADS ${UWSGI_THREADS:-2}

# set invenio path
ENV WORKING_DIR=/opt/invenio

# We invalidate cache always because there is no easy way for now to detect
# if something in the whole git repo changed. For docker git clone <url> <dir>
# is always the same so it caches it.
ARG CACHE_DATE=not_a_date

# get the code at a specific commit
RUN git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git $WORKING_DIR/src
WORKDIR $WORKING_DIR/src

# check if one of the argument is passed to checkout the repo on a specific commit, otherwise use the latest
ARG BRANCH_NAME
ARG COMMIT_ID
ARG TAG_NAME
ARG PR_ID
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

# print current commit id
RUN echo "Current commit id:" && git rev-parse HEAD

ENV INVENIO_INSTANCE_PATH=$WORKING_DIR/var/instance

RUN pip install --upgrade pip==9.0.1
# install Python dependencies
# RUN pip install -r requirements.txt
RUN pip install -r requirements.txt
RUN pip install -e .[all,xrootd]
RUN pip install -r requirements-local-forks.txt

# install/create static files
RUN mkdir -p $INVENIO_INSTANCE_PATH
RUN mkdir -p $INVENIO_INSTANCE_PATH/static
# RUN mv  ./ui/dist $INVENIO_INSTANCE_PATH/static

# set folder permissions
RUN chgrp -R 0 $INVENIO_INSTANCE_PATH && \
    chmod -R g=u $INVENIO_INSTANCE_PATH

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root $INVENIO_INSTANCE_PATH
USER 1000

CMD uwsgi --module ${UWSGI_WSGI_MODULE} --socket 0.0.0.0:${UWSGI_PORT} --master --processes ${UWSGI_PROCESSES} --threads ${UWSGI_THREADS} --stats /tmp/stats.socket
