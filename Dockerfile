FROM node:10.13-alpine
ARG NODE_ENV=development
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN if test \"$NODE_ENV\" = \"production\" ; then npm install --production --silent && mv node_modules ../; else npm install; fi

COPY . .
EXPOSE 3000
CMD node dist/index.js
