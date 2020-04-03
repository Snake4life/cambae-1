FROM nginx:alpine

RUN mkdir -p /etc/letsencrypt/live/
COPY privkey.pem /etc/letsencrypt/live/privkey.pem
COPY fullchain.pem /etc/letsencrypt/live/fullchain.pem
COPY .htpasswd /etc/nginx/.htpasswd
COPY nginx.conf /etc/nginx/nginx.conf
