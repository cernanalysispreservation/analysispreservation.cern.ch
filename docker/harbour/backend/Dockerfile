# list of available base images here: https://gitlab.cern.ch/invenio/base
FROM gitlab-registry.cern.ch/analysispreservation/base:python3

# RUN yum -y install kstart krb5-server krb5-libs krb5-devel

# RUN curl -s -L http://cern.ch/linux/centos7/CentOS-CERN.repo -o /etc/yum.repos.d/CentOS-CERN.repo \
#     && rpm --import http://linuxsoft.cern.ch/cern/centos/7/os/x86_64/RPM-GPG-KEY-cern \
#     && yum install -y epel-release \
#     && yum install -y CERN-CA-certs cern-get-keytab cern-wrappers cern-get-sso-cookie krb5-workstation xmlstarlet python-crypto jq \
#     && curl -s -L http://cern.ch/linux/docs/krb5.conf -o /etc/krb5.conf \
#     && yum clean all

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
ENV CAP_FILES_DIR=$WORKING_DIR/src/var


# Upgrade pip and install packages that need 'cryptography'
# Fails with error when pip==9.0.1
RUN pip install --upgrade pip
RUN pip install python-cern-sso-krb==1.3.3
RUN pip install paramiko==2.7.1

# install Python dependencies
RUN pip install --upgrade pip==9.0.1 # Downgrade to compile correct list
RUN pip install -r requirements.txt
RUN pip install -e .[all,xrootd]
RUN pip install "jsonschema[format]"==3.0.1
RUN pip install -r requirements-local-forks.txt
RUN pip install kombu==4.6.7
RUN pip install gunicorn


RUN cat /etc/ssl/certs/CERN-bundle.pem >>  /usr/local/lib/python3.6/site-packages/certifi/cacert.pem
# RUN cat /etc/ssl/certs/CERN-bundle.pem >>  /lib/python3.5/site-packages/certifi/cacert.pem

# install/create static files
RUN mkdir -p $INVENIO_INSTANCE_PATH
RUN mkdir -p $INVENIO_INSTANCE_PATH/static
RUN mkdir -p $CAP_FILES_DIR
# RUN mv  ./ui/dist $INVENIO_INSTANCE_PATH/static

# set folder permissions
RUN chgrp -R 0 $INVENIO_INSTANCE_PATH $CAP_FILES_DIR && \
    chmod -R g=u $INVENIO_INSTANCE_PATH $CAP_FILES_DIR

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root $INVENIO_INSTANCE_PATH $CAP_FILES_DIR && \
    # chown -R invenio:root /usr/lib/python3.5/site-packages/certifi
    chown -R invenio:root /usr/local/lib/python3.6/site-packages/certifi
USER 1000


CMD uwsgi --module ${UWSGI_WSGI_MODULE} --socket 0.0.0.0:${UWSGI_PORT} --master --processes ${UWSGI_PROCESSES} --threads ${UWSGI_THREADS} --stats /tmp/stats.socket
