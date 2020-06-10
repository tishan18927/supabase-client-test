FROM node:8.9 AS baseWebBuild
WORKDIR /web
# this is used when cleaning cache
LABEL builder=ehr-opd-ui-base
RUN npm install -g @angular/cli

FROM baseWebBuild AS builder
# this is used when cleaning cache
COPY package*.json /web/
RUN npm install; 

COPY . /web/

RUN npm run prod-build


FROM nginx:1.14-alpine
# this is used when cleaning image
COPY nginx.conf.template /nginx.conf.template
LABEL builder=ehr-opd-ui
#COPY favicon.ico /usr/share/nginx/html
COPY --from=builder /web/dist/supabase-client /usr/share/nginx/html/supabase-client/

CMD /bin/sh -c "envsubst < /nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"
