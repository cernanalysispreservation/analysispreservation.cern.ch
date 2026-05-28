FROM python:3.10.15

# Certficates configuartion
ENV PYTHONBUFFERED=0 \
    SSL_CERT_FILE="/etc/ssl/certs/ca-certificates.crt" \
    REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt" \
    PATH="/root/.local/bin:${PATH}" \
    POETRY_VIRTUALENVS_CREATE=false

# Install CERN CA certificates
RUN curl -sL https://cafiles.cern.ch/cafiles/certificates/CERN%20Root%20Certification%20Authority%202.crt \
    -o /usr/local/share/ca-certificates/CERN-Root-CA-2.crt \
    && curl -sL https://cafiles.cern.ch/cafiles/certificates/CERN%20Grid%20Certification%20Authority.crt \
    -o /usr/local/share/ca-certificates/CERN-Grid-CA.crt \
    && update-ca-certificates \
    && cp /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/CERN-bundle.pem

# Install system dependencies
RUN pip config set global.cert "${REQUESTS_CA_BUNDLE}"
RUN curl -s -L http://cern.ch/linux/docs/krb5.conf -o /etc/krb5.conf
RUN curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

RUN apt-get update && apt-get install --no-install-recommends -y \
    gcc libffi-dev locales libxslt-dev libxml2-dev libssl-dev build-essential python3-dev libldap2-dev libsasl2-dev ldap-utils krb5-user git redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN apt-get update -q \
    && apt-get install -y kstart krb5-kdc krb5-admin-server krb5-multidev

# set invenio path
ENV WORKING_DIR=/opt/cap
ENV INVENIO_INSTANCE_PATH=$WORKING_DIR/var/instance
ENV CAP_FILES_DIR=$WORKING_DIR/src/var

# We invalidate cache always because there is no easy way for now to detect
# if something in the whole git repo changed. For docker git clone <url> <dir>
# is always the same so it caches it.
ARG CACHE_DATE=not_a_date

# get the code at a specific commit
RUN git clone https://github.com/cernanalysispreservation/analysispreservation.cern.ch.git $WORKING_DIR/src
WORKDIR $WORKING_DIR/src

# Debug off by default
ARG DEBUG=False
ENV DEBUG=${DEBUG}

# ENABLE_E2E False by default
ARG ENABLE_E2E=False
ENV ENABLE_E2E=${ENABLE_E2E}

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

# Install/create static files
RUN mkdir -p ${INVENIO_INSTANCE_PATH}
RUN mkdir -p $INVENIO_INSTANCE_PATH/static
RUN mkdir -p ${CAP_FILES_DIR}

# install Python dependencies
RUN pip install -e .
RUN pip install gunicorn

RUN cat /etc/ssl/certs/CERN-bundle.pem >>  /usr/local/lib/python3.10/site-packages/certifi/cacert.pem

# set folder permissions
RUN chgrp -R 0 $WORKING_DIR $CAP_FILES_DIR && \
    chmod -R g=u $WORKING_DIR $CAP_FILES_DIR

RUN useradd invenio --uid 1000 --gid 0 && \
    chown -R invenio:root $INVENIO_INSTANCE_PATH $CAP_FILES_DIR && \
    chown -R invenio:root /usr/local/lib/python3.10/site-packages/certifi

USER 1000
