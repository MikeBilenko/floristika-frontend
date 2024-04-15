# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the application code
COPY . /app

# Set environment variables
ENV CI=true
ENV PORT=3000

# Set Node.js memory limit and start the application
CMD ["node", "--max-old-space-size=4096", "app.js"]

# Build stage
FROM development AS build
RUN npm run build

# Set up development environment
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    useradd -s /bin/bash -m vscode && \
    groupadd docker && \
    usermod -aG docker vscode

# Install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "start" ]
