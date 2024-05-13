import { FastifyInstance } from "fastify";
import { registerUserHandler, userTransactionHandler, userWalletsHandler } from "./handler";
import { registerUserSchema } from "./schema";

const registerUserOpts = {
  schema: {
    body: registerUserSchema,
  },
  handler: registerUserHandler,
};

const userWalletOpts =  {
  schema: {
    querystring: {
      userId: { type: 'integer' }
    },
  },
  handler: userWalletsHandler,
};

const userTransactionOpts = {
  schema: {
    querystring: {
      userId: { type: 'integer' }
    },
    params: {
      walletId: { type: 'integer' }
    },
    required: ['walletId']
  },
  handler: userTransactionHandler
};

const userRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  // auth
  fastify.post('/register', registerUserOpts);

  // user wallets
  fastify.get('/user/wallets', userWalletOpts);
  fastify.get('/user/wallets/:walletId/histories', userTransactionOpts);

  done();
}

module.exports = userRoutes;