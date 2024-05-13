import { FastifyInstance } from "fastify";
import { loginHandler } from "./handler";
import { loginSchema } from "./schema";

const loginOpts = {
  schema: {
    description: 'Login User',
    body: loginSchema,
  },
  handler: loginHandler,
};

const authRoutes = (fastify: FastifyInstance, _: any, done: any) => {
  fastify.post('/auth/login', loginOpts);
  done();
}

module.exports = authRoutes;