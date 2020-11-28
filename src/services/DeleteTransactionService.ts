import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<any> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // const transaction = await transactionsRepository.delete({
    //   id,
    // });

    // if (!transaction.affected) throw new AppError('Not founded Id');

    // return transaction;

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Not founded Id');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
