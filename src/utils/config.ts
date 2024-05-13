require('dotenv').config();

export const appConfig = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  jwt: {
    access_token_key: process.env.ACCESS_TOKEN_KEY,
  },
};