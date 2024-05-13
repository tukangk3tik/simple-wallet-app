import { FastifyReply } from "fastify";
import { userService } from "../../di/injection";
import { successMsgResponse } from "../../utils/http/response";
import { verifyAuth } from "../../middleware/auth_middleware";


export const registerUserHandler = async (req: any, reply: FastifyReply) => {
  const { email, password, name } = req.body;
  await userService.registerUser(name, email, password);

  reply.send(successMsgResponse({}, 'Success create new user. Please login'));
}

export const userWalletsHandler = async (req: any, reply: FastifyReply) => {
  const userId = await verifyAuth(req);
  const wallets = await userService.getWallets(userId);

  reply.send(successMsgResponse(wallets, 'Success fetch wallets'));
}

export const userTransactionHandler = async (req: any, reply: FastifyReply) => {
  const userId = await verifyAuth(req);

  const { walletId } = req.params;
  const transactions = await userService.getWalletTransactions(userId, walletId);

  reply.send(successMsgResponse(transactions, 'Success get histories'));
}
