# This file is part of xrootd-docker
# Copyright (C) 2015 CERN.
#
# xrootd-docker is free software; you can redistribute it and/or modify it
# under the terms of the Revised BSD License; see LICENSE file for more
# details.
#
# Docker image for running a simple XRootD server.

FROM centos:7

# Install xrootd
RUN rpm -Uvh http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

RUN yum install -y xrootd xrootd-server xrootd-client xrootd-client-devel xrootd-python

USER xrootd

# Print xrootd version
RUN xrootd -v

CMD ["xrootd"]