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
        useValue: {}
      },
      {
        provide: AuthService,
        useValue: {}
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
        isAdmin: '',
        state: '',
        favoriteBooks: []
      };

      jest.spyOn(userController, 'create').mockImplementation(async () => createdUser);

      const result = await userController.create(createUserDto);

      expect(userController.create).toHaveBeenCalledWith(createUserDto);
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
        isAdmin: '',
        state: '',
        favoriteBooks: []
      };

      const mockToken: JsonWebKey = { Bearer: "abc" };
      jest.spyOn(userController, 'login').mockImplementation(async () => mockToken);

      const result = await userController.login(loginUser);

      expect(userController.login).toHaveBeenCalledWith(loginUser);
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
        isAdmin: '',
        state: '',
        favoriteBooks: []
      };

      jest.spyOn(userController, 'update').mockImplementation(async () => updatedUser);

      const result = await userController.update(userId, updateUserDto);

      expect(userController.update).toHaveBeenCalledWith(userId, updateUserDto);
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
          isAdmin: '',
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
          isAdmin: '',
          state: '',
          favoriteBooks: [],
        },
      ];

      jest.spyOn(userController, 'findAll').mockImplementation(async () => users);

      const result = await userController.findAll();

      expect(userController.findAll).toHaveBeenCalled();
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
        isAdmin: '',
        state: '',
        favoriteBooks: [],
      };

      jest.spyOn(userController, 'findOne').mockImplementation(async () => user);

      const result = await userController.findOne(login);

      expect(userController.findOne).toHaveBeenCalledWith(login);
      expect(result).toEqual(user);
      console.log(user)
      console.log(result)
    });
  });
  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';

      jest.spyOn(userController, 'remove').mockImplementation(async () => {
        return {
          message: 'Item removed successfully',
          status: HttpStatus.OK,
        };
      });

      const result = await userController.remove(userId);

      expect(userController.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        message: 'Item removed successfully',
        status: HttpStatus.OK,
      });
    });
  });

  describe('setToAdmin', () => {
    it('should set user to admin', async () => {
      const userId = '1';

      jest.spyOn(userController, 'setToAdmin').mockImplementation(async () => {
        const user: UserEntity = {
          id: userId,
          name: 'teste',
          username: 'testUser',
          password: '12345',
          province: 'RJ',
          cpf: '12345678901',
          isAdmin: 'ADMIN',
          state: '',
          favoriteBooks: [],
        };
        return user;
      });

      const result = await userController.setToAdmin(userId);

      expect(userController.setToAdmin).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'teste',
        username: 'testUser',
        password: '12345',
        province: 'RJ',
        cpf: '12345678901',
        isAdmin: 'ADMIN',
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
            isAdmin: 'ADMIN',
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
          isAdmin: 'ADMIN',
          state: '',
        };

        jest.spyOn(userController, 'bookmarkBook').mockImplementation(async () => mockedUserEntity);

        const result = await userController.bookmarkBook(userId, book);

        expect(userController.bookmarkBook).toHaveBeenCalledWith(userId, book);
        expect(result).toEqual(mockedUserEntity);
        console.log(book)
        console.log(mockedUserEntity)
        console.log(result)
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
            isAdmin: 'ADMIN',
            state: 'DISPONIVEL',
            favoriteBooks: [],
          };

          jest.spyOn(userController, 'removeBookmarkBook').mockImplementation(async () => mockedUserEntity);

          const result = await userController.removeBookmarkBook(userId, book);

          expect(userController.removeBookmarkBook).toHaveBeenCalledWith(userId, book);
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
                isAdmin: 'ADMIN',
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
                isAdmin: 'ADMIN',
                state: '',
                favoriteBooks: []
              },
              createdAt: new Date(),
            }
          ];

          jest.spyOn(userController, 'findAllBookmarked').mockImplementation(async () => mockedBookmarkedBooks);

          const result = await userController.findAllBookmarked(userId);

          expect(userController.findAllBookmarked).toHaveBeenCalledWith(userId);
          expect(result).toEqual(mockedBookmarkedBooks);
        });

      });
    });
  });
});
