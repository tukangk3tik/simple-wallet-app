import { accountTypeIds } from "../../configs/account_type";
import prisma from "../../configs/database";
import { AuthError } from "../../exceptions/AuthError";
import { ClientError } from "../../exceptions/ClientError";
import { NotFoundException } from "../../exceptions/NotFoundException";
import bcrypt from 'bcrypt';

const randomstring = require('randomstring');

class UserService {
  private _prisma;

  constructor() {
    this._prisma = prisma;
  }

  public async getUserByEmail(email: string) {
    const user = await this._prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    return user;
  }

  public async verifyUserCredentials(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthError('Your credential is not match with our record');
    }

    return user;
  }

  public async registerUser(name: string, email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (user) {
      throw new NotFoundException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nowDate = new Date().toISOString();

    const newUser = await this._prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        createdAt: nowDate,
        updatedAt: nowDate,
      },
    });

    // create debit account
    await prisma.userAccounts.create({
      data: {
        userId: newUser.id,
        accountTypeId: accountTypeIds.debit,
        address: randomstring.generate({
          length: 10,
          charset: ['numeric']
        }),
        balance: 0,
      }
    });

    // create credit account
    await prisma.userAccounts.create({
      data: {
        userId: newUser.id,
        accountTypeId: accountTypeIds.credit,
        address: randomstring.generate({
          length: 10,
          charset: ['numeric']
        }),
        balance: 0,
      }
    });

    return newUser;
  }

  public async getWallets(userId: number) {
    const userWallets = await this._prisma.userAccounts.findMany({
      select: {
        id: true,
        accountTypeId: true,
        accountType: {
          select: {
            accountTypeName: true,
          }
        },
        address: true,
        balance: true,
      },
      where: {
        userId: userId,
        deletedAt: null
      }
    });

    return userWallets;
  }

  public async getWalletTransactions(userId: number, walletId: number) {
    const checkWallet = await this._prisma.userAccounts.findFirst({
      where: {
        userId: userId,
        id: walletId,
      }
    });
    if (!checkWallet) {
      throw new ClientError('Wallet not found');
    }

    const userWalletTransactions = await this._prisma.transaction.findMany({
      select: {
        transaction_id: true,
        userAccount: {
          select: {
            address: true,
            balance: true,
          }
        },
        accountType: {
          select: {
            accountTypeName: true,
          }
        },
        amount: true,
        fromAddress: true,
        toAddress: true,
        transactionTime: true,
        status: true,
        message: true,
      },
      where: {
        userId: userId,
        userAccountId: walletId,
      }
    });

    return userWalletTransactions;
  }

}

export default UserService;