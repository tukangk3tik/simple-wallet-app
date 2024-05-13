import fastify from "fastify";
import { ClientError } from "./src/exceptions/ClientError";
import { errorResponse } from './src/utils/http/response';
import { httpStatusCode } from "./src/utils/http/status_code";
import { appConfig } from "./src/utils/config";

const app = fastify({ logger: true });

app.register(require('@fastify/jwt'), {
  secret: appConfig.jwt.access_token_key 
    ? appConfig.jwt.access_token_key 
    : process.env.ACCESS_TOKEN_KEY || 'youshouldspecifyalongsecret123'
})

app.register(require('./src/api/auth'));
app.register(require('./src/api/user'));
app.register(require('./src/api/transaction'));

app.setErrorHandler((error: ClientError | any, req, reply) => {
  reply
    .status(error.statusCode ?? httpStatusCode.serverError)
    .send(errorResponse(error.message));   
});

const appPort = appConfig.app.port ?? '8080';
const appUrl = appConfig.app.host ?? '0.0.0.0';
app.listen({ port: parseInt(appPort), host: appUrl }, (err, _) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${appUrl}:${appPort}`);
});

