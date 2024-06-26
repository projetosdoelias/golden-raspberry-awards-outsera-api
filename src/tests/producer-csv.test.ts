import request from 'supertest';
import AppDataSource from '../infra/database/data-source';
import { Movie } from '../domain/entities/movie.entity';
import { app } from '../app';
import { Server } from 'http';
import { CSVService } from '../infra/services/csv.service';


describe('Testes da rota dos intervalos entre premiações dos produtores utilizando CSV', () => {
  let server:Server;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await AppDataSource.initialize(); 
    await CSVService.loadMovies();
    server = app.listen();

  });

  afterAll(async () => {

    try {
        server.close();
        await AppDataSource.destroy();
      
    } catch (error) {
      console.error('Error during Data Source destruction:', error);
    }

  });

  it('Deve retornar os dados de acordo com o fornecido na proposta original do teste', async () => {

    
    const response = await request(app).get('/producers/winners/intervals');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    const { min, max } = response.body;

    const minObject = {
      producer: 'Joel Silver',
      interval: 1,
      previousWin: 1990,
      followingWin: 1991
    }

    const maxObject = {
      producer: 'Matthew Vaughn',
      interval: 13,
      previousWin: 2002,
      followingWin: 2015
    }

    expect(min[0]).toEqual(minObject);
    expect(max[0]).toEqual(maxObject);

  });

});