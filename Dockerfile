# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# 
COPY package.json /app/package.json

RUN npm install

COPY . /app

ENV CI=true
ENV PORT=3000

CMD [ "npm", "start" ]

FROM development AS build

RUN npm run build

RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    useradd -s /bin/bash -m vscode && \
    groupadd docker && \
    usermod -aG docker vscode

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]

