FROM node:18-alpine as builder

ARG GIT_SHA
ARG GIT_REF_NAME
ENV COMMIT_SHA $GIT_SHA
ENV COMMIT_REF_NAME $GIT_REF_NAME

ENV NODE_ENV build

WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY . ./

RUN npm run build \
    && npm prune --production

FROM node:18-alpine

ARG GIT_SHA
ARG GIT_REF_NAME
ENV COMMIT_SHA $GIT_SHA
ENV COMMIT_REF_NAME $GIT_REF_NAME

ENV NODE_ENV production

WORKDIR /home/node

COPY --from=builder /home/node/ ./

CMD ["npm", "run", "start:prod"]
