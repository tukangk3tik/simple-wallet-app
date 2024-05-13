import { FastifyInstance } from "fastify";
import { checkTransactionStatusHandler, transactionHandler } from "./handler";
import { withdrawSchema } from "./schema";


const withdrawOpts = {
  schema: {
    body: withdrawSchema,
  },
  handler: transactionHandler
}

const checkTransactionOpts = {
  schema: {
    params: {
      transactionId: { type: 'string' }
    },
    required: ['transactionId']
  },
  handler: checkTransactionStatusHandler
}

const transactionRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  const path = 'transaction';
  fastify.post(`/${path}/withdraw`, withdrawOpts);
  fastify.get(`/${path}/:transactionId`, checkTransactionOpts);
  
  done();
}

module.exports = transactionRoutes;