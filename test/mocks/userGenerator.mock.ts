import {faker } from '@faker-js/faker'
import { randomInt } from 'crypto';
import { UserEntity } from '../../src/user/entities/user.entity';
import { Role, objectState } from '../../src/shared/global.enum';
import { generateMockBookEntity } from './bookGenerator.mock';

export function generateMockUserEntity(): UserEntity {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    username: faker.internet.userName(),
    password: faker.internet.password(12),
    province:faker.location.county(),
    cpf: faker.string.numeric({ length: 11}),
    state:faker.helpers.enumValue(objectState),
    role: faker.helpers.enumValue(Role),
    favoriteBooks: [] = faker.helpers.multiple(generateMockBookEntity, {
      count: randomInt(1,5),
    })  
  };
}


