import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import CreateTransactionService from './CreateTransactionService';

interface RequestDTO {
  filePath: string;
}

class ImportTransactionsService {
  async execute({ filePath }: RequestDTO): Promise<Transaction[]> {
    const contactsReadStream = fs.createReadStream(filePath);
    const createTransactionService = new CreateTransactionService();

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);
    const transactions: Transaction[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) {
        throw new AppError('Invalid values.');
      }

      const newTransaction = await createTransactionService.execute({
        title,
        type,
        value,
        categoryName: category,
      });

      transactions.push(newTransaction);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    fs.promises.unlink(filePath);

    return transactions;
  }
}

export default ImportTransactionsService;
