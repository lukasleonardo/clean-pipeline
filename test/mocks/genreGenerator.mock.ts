import {faker } from '@faker-js/faker'
import { GenreEntity } from '../../src/genre/entities/genre.entity';

export function generateMockGenreEntity(): GenreEntity {
  return {
    id: faker.string.uuid(),
    name: faker.word.noun(),
  };
}
