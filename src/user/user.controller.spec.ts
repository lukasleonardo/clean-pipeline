import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { JsonWebKey } from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpStatus } from '@nestjs/common';
import { BookEntity } from '../book/entities/book.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          create: jest.fn(),
          login: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
          setToAdmin: jest.fn(),
          bookmarkBook: jest.fn(),
          removeBookmarkBook: jest.fn(),
          findAllBookmarked: jest.fn(),
        }
      },
      {
        provide: AuthService,
        useValue: {
          login: jest.fn()
        }
      },
      {
        provide: UserController,
        useValue: {}
      }
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'teste4',
        username: 'teste4',
        password: '123456',
        province: 'rio de janeiro',
        cpf: '17378660743',
      };

      const createdUser: UserEntity = {
        id: '1',
        name: 'teste4',
        username: 'teste4',
        province: 'rio de janeiro',
        cpf: '17378660743',
        password: '12345',
        role: '',
        state: '',
        favoriteBooks: []
      };
      jest.spyOn(userService, 'create').mockImplementation(async () => createdUser);

      const result = await userController.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });
  describe('login', () => {
    it('should login a user', async () => {
      const loginUser: UserEntity = {
        username: 'testUser',
        password: 'testPassword',
        id: '1',
        name: 'teste',
        province: 'a',
        cpf: '1234',
        role: '',
        state: '',
        favoriteBooks: []
      };

      const mockToken: JsonWebKey = { Bearer: "abc" };
      jest.spyOn(authService, 'login').mockResolvedValueOnce(mockToken);

      const result = await userController.login(loginUser);

      expect(authService.login).toHaveBeenCalledWith(loginUser);
      expect(result).toEqual(mockToken);
    });
  });
  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        username: "banana"
      };
      const updatedUser: UserEntity = {
        id: '1',
        name: 'teste',
        username: 'banana',
        password: '12345',
        province: 'rj',
        cpf: '12345',
        role: '',
        state: '',
        favoriteBooks: []
      };

      jest.spyOn(userService, 'update').mockImplementation(async () => updatedUser);

      const result = await userController.update(userId, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result.username).toEqual(updateUserDto.username);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: UserEntity[] = [
        {
          id: '1',
          name: 'teste1',
          username: 'teste1',
          password: '12345',
          province: 'RJ',
          cpf: '12345678901',
          role: '',
          state: '',
          favoriteBooks: [],
        },
        {
          id: '2',
          name: 'teste2',
          username: 'test22',
          password: '54321',
          province: 'SP',
          cpf: '98765432109',
          role: '',
          state: '',
          favoriteBooks: [],
        },
      ];

      jest.spyOn(userService, 'findAll').mockImplementation(async () => users);

      const result = await userController.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by login', async () => {
      // Arrange
      const login = 'user1';
      const user: UserEntity = {
        id: '1',
        name: 'User 1',
        username: login,
        password: '12345',
        province: 'RJ',
        cpf: '12345678901',
        role: '',
        state: '',
        favoriteBooks: [],
      };

      jest.spyOn(userService, 'findOne').mockImplementation(async () => user);

      const result = await userController.findOne(login);

      expect(userService.findOne).toHaveBeenCalledWith(login);
      expect(result).toEqual(user);
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';

      jest.spyOn(userService, 'remove').mockImplementation(async () => {
        return {
          message: 'Item removed successfully',
          status: HttpStatus.OK,
        };
      });

      const result = await userController.remove(userId);

      expect(userService.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      });
    });
  });
  describe('setToAdmin', () => {
    it('should set user to admin', async () => {
      const userId = '1';

      jest.spyOn(userService, 'setToAdmin').mockImplementation(async () => {
        const user: UserEntity = {
          id: userId,
          name: 'teste',
          username: 'testUser',
          password: '12345',
          province: 'RJ',
          cpf: '12345678901',
          role: 'ADMIN',
          state: '',
          favoriteBooks: [],
        };
        return user;
      });

      const result = await userController.setToAdmin(userId);

      expect(userService.setToAdmin).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'teste',
        username: 'testUser',
        password: '12345',
        province: 'RJ',
        cpf: '12345678901',
        role: 'ADMIN',
        state: '',
        favoriteBooks: [],
      });
    });
    describe('bookMark', () => {
      it('should bookmark a book for a user', async () => {
        const userId = '1';
        const book: BookEntity = {
          id: '1',
          name: 'galos',
          description: 'galos galaticos',
          author: 'galo cego',
          value: 0,
          state: 'DISPONIVEL',
          genreList: [],
          createdBy: {
            id: '1',
            name: 'teste',
            username: 'teste',
            password: '12345',
            province: '12345',
            cpf: '12345',
            role: 'ADMIN',
            state: '',
            favoriteBooks: []
          },
          createdAt: new Date(),
        };
        const mockedUserEntity: UserEntity = {
          id: userId,
          name: 'Usuário Mockado',
          favoriteBooks: [book],
          username: 'teste',
          password: '12345',
          province: '12345',
          cpf: '12345',
          role: 'ADMIN',
          state: '',
        };

        jest.spyOn(userService, 'bookmarkBook').mockImplementation(async () => mockedUserEntity);

        const result = await userController.bookmarkBook(userId, book);

        expect(userService.bookmarkBook).toHaveBeenCalledWith(userId, book);
        expect(result).toEqual(mockedUserEntity);
      });
    });
    describe('Remove bookmarked', () => {
      it('should remove a bookmarked book for a user', async () => {
        const userId = '1';
        const book: BookEntity = {
          id: '1',
          name: 'galos galaticos',
          description: 'amoeba roxa',
          author: 'sol mandado',
          value: 0,
          state: 'DISPONIVEL',
          createdAt: new Date('2023-11-14T03:50:42.847Z'),
          genreList: [
            {
              id: '1',
              name: 'sexo',
            },
          ],
          createdBy: new UserEntity
        };

        const mockedUserEntity: UserEntity = {
          id: userId,
          name: 'teste4',
          username: 'teste4',
          password: '12345',
          province: 'rio de janeiro',
          cpf: '17378660743',
          role: 'ADMIN',
          state: 'DISPONIVEL',
          favoriteBooks: [],
        };

        jest.spyOn(userService, 'removeBookmarkBook').mockImplementation(async () => mockedUserEntity);

        const result = await userController.removeBookmarkBook(userId, book);

        expect(userService.removeBookmarkBook).toHaveBeenCalledWith(userId, book);
        expect(result).toEqual(mockedUserEntity);
      });
    });
    describe('findAll bookmarked', () => {
      it('should return all bookmarked books for a user', async () => {
        const userId = '1';
        const mockedBookmarkedBooks: BookEntity[] = [
          {
            id: '1',
            name: 'galos',
            description: 'galos galaticos',
            author: 'galo cego',
            value: 0,
            state: 'DISPONIVEL',
            genreList: [],
            createdBy: {
              id: '1',
              name: 'teste',
              username: 'teste',
              password: '12345',
              province: '12345',
              cpf: '12345',
              role: 'ADMIN',
              state: '',
              favoriteBooks: []
            },
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'galos 2',
            description: 'galos galaticos 2 o retorno',
            author: 'galo cego',
            value: 0,
            state: 'DISPONIVEL',
            genreList: [],
            createdBy: {
              id: '1',
              name: 'teste',
              username: 'teste',
              password: '12345',
              province: '12345',
              cpf: '12345',
              role: 'ADMIN',
              state: '',
              favoriteBooks: []
            },
            createdAt: new Date(),
          }
        ];

        jest.spyOn(userService, 'findAllBookmarked').mockImplementation(async () => mockedBookmarkedBooks);

        const result = await userController.findAllBookmarked(userId);

        expect(userService.findAllBookmarked).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mockedBookmarkedBooks);
      });

    });
  });
});
