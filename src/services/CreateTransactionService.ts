import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  categoryName: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryName,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    let categoryId: string;

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && !(value < total)) {
      throw new AppError('insufficient pounds!');
    }

    const category = await categoryRepository.findOne({
      where: {
        title: categoryName,
      },
    });

    if (!category) {
      const newCategory = categoryRepository.create({
        title: categoryName,
      });

      await categoryRepository.save(newCategory);
      categoryId = newCategory.id;
    } else {
      categoryId = category.id;
    }

    const newTransaction = transactionsRepository.create({
      title,
      type,
      value,
      categoryId,
    });

    await transactionsRepository.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
