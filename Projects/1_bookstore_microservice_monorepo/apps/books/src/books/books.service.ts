import { Injectable } from '@nestjs/common';
import { UpdateBookDto, BookDto, CreateBookDto } from '@app/contracts';

@Injectable()
export class BooksService {
  private books: BookDto[] = [
    {
      id: 1,
      title: 'Book 1',
      author: 'Author 1',
      rating: 4.5,
    },
    {
      id: 2,
      title: 'Book 2',
      author: 'Author 2',
      rating: 4.5,
    },
  ];

  create(createBookDto: CreateBookDto) {
    const newBook: BookDto = {
      id: this.books.length + 1,
      ...createBookDto,
    };
    this.books.push(newBook);
    return newBook;
  }

  findAll() {
    return this.books;
  }

  findOne(id: number) {
    return this.books.find((b) => b.id === id) || `Book #${id} not found`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updateBookDto };
      return this.books[index];
    }
    return `Book #${id} not found`;
  }

  remove(id: number) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index !== -1) {
      const deleted = this.books.splice(index, 1);
      return deleted[0];
    }
    return `Book #${id} not found`;
  }
}
