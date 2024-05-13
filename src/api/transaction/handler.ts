import { FastifyReply } from "fastify";
import { successMsgResponse } from "../../utils/http/response";
import { transactionService } from "../../di/injection";
import { verifyAuth } from "../../middleware/auth_middleware";

export const transactionHandler = async (req: any, reply: FastifyReply) => {
  const userId = await verifyAuth(req);
  const { accountType, amount, toAddress } = req.body;
  const { trxId, message } = await transactionService.withdraw(
    parseInt(userId), parseInt(accountType), parseFloat(amount), toAddress
  );

  reply.send(successMsgResponse(
    {
      transaction_id: trxId
    },
    message,
  ))
}

export const checkTransactionStatusHandler = async (req: any, reply: FastifyReply) => {
  const userId = await verifyAuth(req);

  const { transactionId } = req.params;
  const trxResult = await transactionService.checkTransactionStatus(transactionId, userId);
  
  reply.send(successMsgResponse(
    trxResult,
    'Success fetch transaction'
  ))
}