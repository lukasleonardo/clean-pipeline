import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker'
import { generateMockUserEntity } from '../../test/mocks/userGenerator.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>
  let bookRepository: Repository<BookEntity>
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,{
        provide:getRepositoryToken(BookEntity),  
        useClass: Repository
      },{
        provide:getRepositoryToken(UserEntity),  
        useClass: Repository
      }],
    }).compile();

    userService = module.get<UserService>(UserService);
    bookRepository = module.get<Repository<BookEntity>>(getRepositoryToken(BookEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('test for find all users',()=>{
    it('it should return all users', async()=>{
      const userMock = faker.helpers.multiple(generateMockUserEntity, {count: 4})
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(userMock);
      const resultado = await userService.findAll(); 

      expect(resultado).toEqual(userMock);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    })
  })
});
