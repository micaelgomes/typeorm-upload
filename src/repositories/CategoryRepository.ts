import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class TransactionsRepository extends Repository<Category> {}

export default TransactionsRepository;
