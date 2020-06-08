FROM nginx:alpine
LABEL MAINTAINER="Francisco Mendoza <fmendoza@tinet.cl>"

COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY dist/ .
