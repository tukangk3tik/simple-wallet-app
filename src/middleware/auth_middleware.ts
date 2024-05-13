import fastify, { FastifyInstance, FastifyReply } from "fastify";
import { AuthError } from "../exceptions/AuthError";

export async function verifyAuth(req: any) {
  try {
    const userCredentials = await req.jwtVerify();
    return userCredentials.sub;
  } catch (error) {
    throw new AuthError('Unauthorized. Token is not provided or expired');
  }
}