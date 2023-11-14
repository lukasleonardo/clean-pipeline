import { Roles } from "../src/auth/guards/roles.decorator";
import { UserEntity } from "../src/user/entities/user.entity";

export const userMock = [{
    id: "1",
    name: "teste",
    username: "teste",
    password: "123456",
    province: "rj",
    cpf: "12343566",
    state: "rj",
    isAdmin: "USER",
    favoriteBooks: [],

},
  {
      id: "2",
    name: "teste2",
    username: "teste2",
    password: "123456",
    province: "rj",
    cpf: "123435662",
    state: "rj",
    isAdmin: "ADMIN",
    favoriteBooks: [],
}]

