
import { BookEntity } from "../../src/book/entities/book.entity";


const date = new Date()
export const bookMock: BookEntity[] = [
  // Adicione alguns livros fictícios para simular o retorno do repositório
  {
    id: "1",
    name: "name 1",
    description: "lorem ipsum",
    author: "pessoa 1",
    value: 100,
    state: "DISPONIVEL",
    createdAt: date,
    createdBy: {
			id: "1",name: "name 1",username: "admin",password: "123456",
			province: "lugar 1",cpf: "123123",isAdmin: "ADMIN",state: "INDISPONIVEL",
			favoriteBooks: []
		},
    genreList: [{id: "1", name: "name 1"}, {id: "2", name: "name 2"},{id: "3", name: "name 3"}]
  },
  {  
  id: "2",
  name: "name 2",
  description: "lorem ipsum",
  author: "pessoa 2",
  value: 200,
  state: "DISPONIVEL",
  createdAt: date,
  createdBy: {
    id: "2",name: "name 2",username: "admin",password: "223456",
    province: "lugar 2",cpf: "223223",isAdmin: "ADMIN",state: "INDISPONIVEL",
    favoriteBooks: []
  },
  genreList: [ {id: "2", name: "name 2"},{id: "3", name: "name 3"}]
},
{ 
  id: "3",
  name: "name 3",
  description: "lorem ipsum",
  author: "pessoa 3",
  value: 300,
  state: "DISPONIVEL",
  createdAt: date,
  createdBy: {
    id: "3",name: "name 3",username: "admin",password: "333456",
    province: "lugar 3",cpf: "333333",isAdmin: "ADMIN",state: "INDISPONIVEL",
    favoriteBooks: []
  },
  genreList: [{id: "1", name: "name 1"}, {id: "3", name: "name 3"},{id: "3", name: "name 3"}]
}
];