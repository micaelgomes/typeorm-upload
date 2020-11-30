import { request, Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;
  const CreateTransaction = new CreateTransactionService();
  const transaction = await CreateTransaction.execute({
    title,
    type,
    value,
    categoryName: category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  const transactionDeleted = await deleteTransaction.execute({ id });

  return response.json({ id, transactionDeleted });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const filePath = request.file.path;
    const importTransactions = new ImportTransactionsService();
    const transactions = await importTransactions.execute({ filePath });

    return response.json(transactions);
  },
);

export default transactionsRouter;
