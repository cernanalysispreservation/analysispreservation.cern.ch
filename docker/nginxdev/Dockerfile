FROM nginx

RUN openssl req -x509 -nodes -days 365 -subj "/C=CH/ST=GVA/O=Company, Inc." \
    -newkey rsa:2048 -keyout /etc/ssl/private/dev-nginx-selfsigned.key -out /etc/ssl/certs/dev-nginx-selfsigned.crt;

COPY default.conf /etc/nginx/conf.d/default.conf


CMD ["nginx", "-g", "daemon off;"]