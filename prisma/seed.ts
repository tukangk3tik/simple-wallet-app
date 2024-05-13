import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { accountTypeIds } from '../src/configs/account_type';

const prisma = new PrismaClient();

async function main() {
  // seeding account type
  const debtAcc = await prisma.accountType.upsert({
    where: { id: accountTypeIds.debit  },
    update: {},
    create: {
      accountTypeName: 'DEBIT'
    }
  });

  const creditAcc = await prisma.accountType.upsert({
    where: { id: accountTypeIds.credit },
    update: {},
    create: {
      accountTypeName: 'CREDIT'
    }
  }); 

  const loanAcc = await prisma.accountType.upsert({
    where: { id: accountTypeIds.loan },
    update: {},
    create: {
      accountTypeName: 'LOAN'
    }
  }); 

  // seeding user
  const hashedPassword = await bcrypt.hash('test1234', 10); 

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: hashedPassword,
    },
  })

  const alicaDebtAcc = await prisma.userAccounts.findFirst(
    {
      where: { 
        userId: alice.id, 
        accountTypeId: debtAcc.id 
      } 
  });

  if (!alicaDebtAcc) {
    await prisma.userAccounts.create({
      data: {
        userId: alice.id,
        accountTypeId: debtAcc.id,
        address: '1134567890',
        balance: 100,
      }
    });
  }

  const alicaCreditAcc = await prisma.userAccounts.findFirst(
    {
      where: { 
        userId: alice.id, 
        accountTypeId: creditAcc.id 
      } 
  });

  if (!alicaCreditAcc) {
    await prisma.userAccounts.create({
      data: {
        userId: alice.id,
        accountTypeId: creditAcc.id,
        address: '1234567890',
        balance: 100,
      }
    });
  }
 

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: hashedPassword,
    },
  })

  const bobDebtAcc = await prisma.userAccounts.findFirst(
    {
      where: { 
        userId: bob.id, 
        accountTypeId: debtAcc.id 
      } 
  });

  if (!bobDebtAcc) {
    await prisma.userAccounts.create({
      data: {
        userId: bob.id,
        accountTypeId: debtAcc.id,
        address: '1145678901',
        balance: 100,
      }
    });
  }

  const bobCreditAcc = await prisma.userAccounts.findFirst(
    {
      where: { 
        userId: bob.id, 
        accountTypeId: creditAcc.id 
      } 
  });

  if (!bobCreditAcc) {
    await prisma.userAccounts.create({
      data: {
        userId: bob.id,
        accountTypeId: creditAcc.id,
        address: '1214567890',
        balance: 100,
      }
    });
  }
 


  console.log({ alice })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })