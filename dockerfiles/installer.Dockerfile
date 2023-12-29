FROM node:20

WORKDIR /usr/src/app

RUN chown -R node:node .
RUN chmod -R 777 .

USER root