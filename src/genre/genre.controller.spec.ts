import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { HttpStatus } from '@nestjs/common';
import { mock } from 'jest-mock-extended'
import { Repository } from 'typeorm';

const repositoryMock = mock<Repository<GenreEntity>>()

export const getConnection = jest.fn().mockReturnValue({
  getRepository: () => repositoryMock,
  getConnection: () => Repository,
});

const newGenreEntity = new GenreEntity()
newGenreEntity.name='Drama' 

const mockRepository = {
  create:jest.fn().mockResolvedValue(newGenreEntity),
  remove:jest.fn().mockResolvedValue({
    message: 'Item removed successfully',
    status: HttpStatus.OK,
  })
}
describe('GenreController', () => {
  let genreController: GenreController;
  let genreService:GenreService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        {
        provide:GenreService,
        useValue:mockRepository,
      }],
    }).compile();

    genreController = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService)
  
  });

  it('should be defined', () => {
    expect(genreController).toBeDefined();
    expect(genreService).toBeDefined();
  });

  describe('create',()=>{
    
    it('should return a genre entity successfuly', async()=>{
      const mockDto: CreateGenreDto = {  name: 'Drama'}
      //act
      const result = await genreController.create(mockDto)
      //assert
      expect(result).toEqual(newGenreEntity)
      expect(typeof result).toEqual('object')
    })

/////////////////////////////////////
   it('Deve retornar um erro se o gênero já existe', async () => {
      
      
    });
  
  })


  describe('remove', ()=>{
    it('should remove successfuly a genre entity', async()=>{ 
      
      const mockDto: CreateGenreDto = {  name: 'Drama'}
      const temp = await genreController.create(mockDto)
      const existingMockId= temp.id
      const expected = JSON.stringify( 
        {
          message: 'Item removed successfully',
          status: 200,
        })
      const result = await genreController.remove(existingMockId)
      expect(JSON.stringify(result)).toBe(expected)
    })
  })



    // it('Deve retornar um erro se o gênero já existe', async () => {
    //   const mockGenreEntity: CreateGenreDto = {  name: 'Drama'}
    //   const mockRepository = MockRepository<GenreEntity>()

    //   when(mockRepository.findOne(deepEqual({ name: 'Drama' }))).thenReject(new Error());
      
    //   await expect(genreController.create(mock)).rejects.toThrow()
    // });


 });


