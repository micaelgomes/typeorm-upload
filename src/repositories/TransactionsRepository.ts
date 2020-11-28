import { EntityRepository, Repository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const allTransactions = await this.find();

    allTransactions.forEach(transaction => {
      balance.income +=
        transaction.type === 'income' ? Number(transaction.value) : 0;
      balance.outcome +=
        transaction.type === 'outcome' ? Number(transaction.value) : 0;
    });

    balance.total = balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
