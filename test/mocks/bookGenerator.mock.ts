import {faker } from '@faker-js/faker'
import { BookEntity } from '../../src/book/entities/book.entity';
import { generateMockGenreEntity } from './genreGenerator.mock';
import { objectState } from '../../src/shared/global.enum';

export function generateMockBookEntity(): BookEntity {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.words({min:3,max:5}),
    description: faker.lorem.text(),
    author: faker.person.fullName(),
    state:faker.helpers.enumValue(objectState),
    value: faker.number.float({precision:2, min: 40.00, max:500.00}),
    createdAt: faker.date.anytime(),
    genreList: [] = faker.helpers.multiple(generateMockGenreEntity, {
      count: faker.number.int({max:4}),
    }),
    createdBy: {
      id: "1",
      name: "Usuario",
      username: "admin",
      password: "password",
      province: "province",
      cpf: "99999",
      role: "ADMIN",
      state: "INDISPONIVEL",
      favoriteBooks: []
    }, 
  };
}

