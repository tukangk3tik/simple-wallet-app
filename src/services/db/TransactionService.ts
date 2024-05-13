import prisma from "../../configs/database";
import { v4 as uuidv4 } from 'uuid';
import { ClientError } from "../../exceptions/ClientError";
import { UserAccounts } from "@prisma/client";

const transactionStatus = {
  process: 'PROCESS',
  success: 'SUCCESS',
  fail: 'FAIL',
}

class TransactionService {
  private _prisma;

  constructor() {
    this._prisma = prisma;
  }

  public async getUserAccount(userId: number, accountType: number) {
    const account = await this._prisma.userAccounts.findFirst({
      where: {
        userId: userId,
        accountTypeId: accountType,
      }
    });

    return account;
  }

  public async checkTransactionStatus(transactionId: string, userId: number) {
    const trx = await this._prisma.transaction.findFirst({
      where: {
        transaction_id: transactionId,
        userId: userId,
      },
      select: {
        transaction_id: true,
        amount: true,
        fromAddress: true,
        toAddress: true,
        transactionTime: true,
        finishTime: true,
        status: true,
        message: true,
      }
    });

    if (!trx) {
      throw new ClientError('Transaction not found'); 
    }

    return trx;
  }

  public async withdraw(
    userId: number, accountType: number, 
    amount: number, toAddress: string,
  ) {
    const isAddressExists = await this._prisma.userAccounts.findFirst({
      where: { address: toAddress, deletedAt: null }
    });

    if (!isAddressExists) {
      throw new ClientError('The receiver address is not available, please check again');
    }

    if (isAddressExists.userId == userId) {
      throw new ClientError('Receiver address is cannot same as sender address');
    }

    const account = await this.getUserAccount(userId, accountType);
    if (!account || (account && account.balance < amount)) {
      throw new ClientError('Sorry, your balance is not enough');
    }

    const nowDate = new Date().toISOString();
    const newTrxId = `wd-${uuidv4()}`;

    const msg = 'Your withdrawal is being processing, please wait';
    const transaction = await this._prisma.transaction.create({
      data: {
        transaction_id: newTrxId,
        userAccountId: account.id, 
        userId: userId,
        accountTypeId: accountType,
        amount: -amount,
        fromAddress: '',
        toAddress: toAddress,
        transactionTime: nowDate,
        status: transactionStatus.process,
        message: msg,
      }
    });

    if (!transaction) {
      throw new ClientError('Something error, please contact the admin');
    }

    this.processWithdraw(
      newTrxId, userId, accountType, amount, toAddress,
      isAddressExists,
    );

    return {
      trxId: newTrxId,
      message: msg,
    }; 
  }

  private async processWithdraw(
    transactionId: string, userId: number, 
    accountType: number, amount: number,
    toAddress: string, receiverAccount: UserAccounts
  ) {
    console.log(`Starting process transaction [ ${transactionId} ]`);

    setTimeout(async () => {
      const nowDate = new Date().toISOString();
    
      const account = await this.getUserAccount(userId, accountType);
      if (!account || (account && account.balance < amount)) {
        await this._prisma.transaction.update({
          where: {
            transaction_id: transactionId,
          },
          data: {
            status: transactionStatus.fail,
            message: 'Sorry, withdrawal is fail. Your balance is not enough',
          }
        });
        return;
      }

      // deduct sender balance
      await this._prisma.userAccounts.update({
        data: {
          balance: (account.balance - amount),
          updatedAt: nowDate,
        },
        where: {
          id: account.id
        }
      });

      // updating sender transaction record
      await this._prisma.transaction.update({
        where: {
          transaction_id: transactionId,
        },
        data: {
          userAccountId: account.id,
          finishTime: nowDate,
          status: transactionStatus.success,
          message: `Success, ${amount} has send to ${toAddress}`,
        }
      });

      // add receiver balance
      await this._prisma.userAccounts.update({
        data: {
          balance: { increment: amount },
          updatedAt: nowDate, 
        },
        where: {
          address: toAddress
        }
      });

      // set transaction history for receiver
      const newTrxId = `rc-${uuidv4()}`;
      await this._prisma.transaction.create({
        data: {
          transaction_id: newTrxId,
          userAccountId: receiverAccount.id,
          userId: receiverAccount.userId,
          accountTypeId: receiverAccount.accountTypeId,
          amount: amount,
          fromAddress: account.address,
          toAddress: '',
          transactionTime: nowDate,
          finishTime: nowDate,
          status: transactionStatus.success,
          message: `You receive ${amount} from ${account.address}`,
        }
      });

      console.log(`Transaction [ ${transactionId} ] is successfully processed`);
    }, 30000);
  }
}

export default TransactionService;