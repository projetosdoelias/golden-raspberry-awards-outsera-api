import request from 'supertest';
import AppDataSource from '../infra/database/data-source';
import { Movie } from '../domain/entities/movie.entity';
import { app } from '../app';
import { Server } from 'http';


describe('Testes da rota dos intervalos entre premiações dos produtores', () => {
  let server:Server;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await AppDataSource.initialize(); 
    server = app.listen();
  });

  afterEach(async () => {
    const movieRepository = AppDataSource.getRepository(Movie);
    await movieRepository.clear();
  });

  afterAll(async () => {

    try {
        server.close();
        await AppDataSource.destroy();
      
    } catch (error) {
      console.error('Error during Data Source destruction:', error);
    }

  });

  it('deve retornar objeto para cada produtor quando forem mais de um produtor para o mesmo filme ou intervalo mínimo', async () => {

    const movieRepository = AppDataSource.getRepository(Movie);

    const movies: Movie[] = [
      { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Joe, john and joão', winner: true },
      { year: 2001, title: 'Movie 2', studios: 'Studio 2', producers: 'Joe, john and joão', winner: true },
      { year: 2015, title: 'Movie 99', studios: 'Studio 2', producers: 'jose', winner: true },
      { year: 2016, title: 'Movie 88', studios: 'Studio 2', producers: 'jose', winner: true },
      { year: 1975, title: 'Movie 3', studios: 'Studio 3', producers: 'Joane', winner: true },
      { year: 2019, title: 'Movie 4', studios: 'Studio 4', producers: 'Joane', winner: true },
      { year: 2099, title: 'Movie 4', studios: 'Studio 4', producers: 'Joane', winner: false },
      { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
    ];

    await movieRepository.save(movies);

    const response = await request(app).get('/producers/winners/intervals');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    const { min, max } = response.body;

    const joeObject = {
      producer: 'Joe',
      interval: 1,
      previousWin: 2000,
      followingWin: 2001
    }

    const johnObject = {
      producer: 'john',
      interval: 1,
      previousWin: 2000,
      followingWin: 2001
    }

    const joaoObject = {
      producer: 'joão',
      interval: 1,
      previousWin: 2000,
      followingWin: 2001
    }

    const joseObject = {
      producer: 'jose',
      interval: 1,
      previousWin: 2015,
      followingWin: 2016
    }

    const joaneObject = {
      producer: 'Joane',
      interval: 44,
      previousWin: 1975,
      followingWin: 2019
    }

    expect(min[0]).toEqual(joeObject);
    expect(min[1]).toEqual(johnObject);
    expect(min[2]).toEqual(joaoObject);
    expect(min[3]).toEqual(joseObject);    
    expect(max[0]).toEqual(joaneObject);

  });

  it('deve retornar intervalo máximo e mínimo correto para produtores que venceram o premio mais de uma vez', async () => {
    const movieRepository = AppDataSource.getRepository(Movie);

    const movies: Movie[] = [
      { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: true },
      { year: 2002, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 1', winner: true },
      { year: 2001, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer 2', winner: true },
      { year: 2004, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer 2', winner: true },
      { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
    ];

    await movieRepository.save(movies);

    const response = await request(app).get('/producers/winners/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    const { min, max } = response.body;

    expect(min[0]).toHaveProperty('producer');
    expect(min[0]).toHaveProperty('interval');
    expect(min[0]).toHaveProperty('previousWin');
    expect(min[0]).toHaveProperty('followingWin');
    expect(min[0].interval).toBe(2);

    expect(max[0]).toHaveProperty('producer');
    expect(max[0]).toHaveProperty('interval');
    expect(max[0]).toHaveProperty('previousWin');
    expect(max[0]).toHaveProperty('followingWin');
    expect(max[0].interval).toBe(3);

  });

  it('deve retornar intervalos máximos e mínimos vazios, pois não houve nenhum vencedor em mais de um ano', async () => {
    const movieRepository = AppDataSource.getRepository(Movie);

    const movies: Movie[] = [
      { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: true },
      { year: 2002, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 1', winner: false },
      { year: 2001, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer 2', winner: false },
      { year: 2004, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer 2', winner: false },
      { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
    ];

    await movieRepository.save(movies);

    const response = await request(app).get('/producers/winners/intervals');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    const { min, max } = response.body;

    expect(min).toBeInstanceOf(Array);
    expect(max).toBeInstanceOf(Array);

    expect(min.length).toBe(0);
    expect(max.length).toBe(0);
  });
});