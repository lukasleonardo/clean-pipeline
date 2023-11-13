import {faker } from '@faker-js/faker'
import { BookEntity } from '../../src/book/entities/book.entity';
import { generateMockGenreEntity } from './genreGenerator.mock';
import { randomInt } from 'crypto';
import { objectState } from '../../src/shared/global.enum';
import { generateMockUserEntity } from './userGenerator.mock';

// Função para gerar um mock de BookEntity
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
      count: randomInt(4),
    }),
    createdBy: {
			id: "45009675-b6d1-4fd0-8e79-76e00abe4e86",
			name: "Super Usuario",
			username: "admin",
			password: "$2b$08$MjfbfXgFTrAadigq5bVLnODH/Tgo4ie6hA5ITXeNziRPF685cI5XS",
			province: "Morro do Dendê",
			cpf: "99999",
			isAdmin: "ADMIN",
			state: "INDISPONIVEL",
			favoriteBooks: []
		}, 
  };
}

