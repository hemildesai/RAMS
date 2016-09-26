import knex from './db';
import Bookshelf from 'bookshelf';

const bookshelf = Bookshelf(knex);
bookshelf.plugin('registry');

export default bookshelf
