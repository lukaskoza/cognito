FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install -g bun

RUN chmod +x ./local/node/entrypoint.sh

CMD ["sh", "./local/node/entrypoint.sh"]