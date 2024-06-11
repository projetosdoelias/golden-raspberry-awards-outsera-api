"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const data_source_1 = __importDefault(require("../infra/database/data-source"));
const movie_entity_1 = require("../domain/entities/movie.entity");
const app_1 = require("../app");
describe('Testes da rota dos intervalos entre premiações dos produtores', () => {
    let server;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = 'test';
        yield data_source_1.default.initialize();
        server = app_1.app.listen();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
        yield movieRepository.clear();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            server.close();
            yield data_source_1.default.destroy();
        }
        catch (error) {
            console.error('Error during Data Source destruction:', error);
        }
    }));
    it('deve retornar objeto para cada produtor quando forem mais de um produtor para o mesmo filme ou intervalo mínimo', () => __awaiter(void 0, void 0, void 0, function* () {
        const movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
        const movies = [
            { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Joe, john and joão', winner: true },
            { year: 2001, title: 'Movie 2', studios: 'Studio 2', producers: 'Joe, john and joão', winner: true },
            { year: 2015, title: 'Movie 99', studios: 'Studio 2', producers: 'jose', winner: true },
            { year: 2016, title: 'Movie 88', studios: 'Studio 2', producers: 'jose', winner: true },
            { year: 1975, title: 'Movie 3', studios: 'Studio 3', producers: 'Joane', winner: true },
            { year: 2019, title: 'Movie 4', studios: 'Studio 4', producers: 'Joane', winner: true },
            { year: 2099, title: 'Movie 4', studios: 'Studio 4', producers: 'Joane', winner: false },
            { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
        ];
        yield movieRepository.save(movies);
        const response = yield (0, supertest_1.default)(app_1.app).get('/producers/winners/intervals');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('min');
        expect(response.body).toHaveProperty('max');
        const { min, max } = response.body;
        const joeObject = {
            producer: 'Joe',
            interval: 1,
            previousWin: 2000,
            followingWin: 2001
        };
        const johnObject = {
            producer: 'john',
            interval: 1,
            previousWin: 2000,
            followingWin: 2001
        };
        const joaoObject = {
            producer: 'joão',
            interval: 1,
            previousWin: 2000,
            followingWin: 2001
        };
        const joseObject = {
            producer: 'jose',
            interval: 1,
            previousWin: 2015,
            followingWin: 2016
        };
        const joaneObject = {
            producer: 'Joane',
            interval: 44,
            previousWin: 1975,
            followingWin: 2019
        };
        console.log(min);
        expect(min[0]).toEqual(joeObject);
        expect(min[1]).toEqual(johnObject);
        expect(min[2]).toEqual(joaoObject);
        expect(min[3]).toEqual(joseObject);
        expect(max[0]).toEqual(joaneObject);
    }));
    it('deve retornar intervalo máximo e mínimo correto para produtores que venceram o premio mais de uma vez', () => __awaiter(void 0, void 0, void 0, function* () {
        const movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
        const movies = [
            { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: true },
            { year: 2002, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 1', winner: true },
            { year: 2001, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer 2', winner: true },
            { year: 2004, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer 2', winner: true },
            { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
        ];
        yield movieRepository.save(movies);
        const response = yield (0, supertest_1.default)(app_1.app).get('/producers/winners/intervals');
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
    }));
    it('deve retornar intervalos máximos e mínimos vazios, pois não houve nenhum vencedor em mais de um ano', () => __awaiter(void 0, void 0, void 0, function* () {
        const movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
        const movies = [
            { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer 1', winner: true },
            { year: 2002, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer 1', winner: false },
            { year: 2001, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer 2', winner: false },
            { year: 2004, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer 2', winner: false },
            { year: 2003, title: 'Movie 5', studios: 'Studio 5', producers: 'Producer 3', winner: false }
        ];
        yield movieRepository.save(movies);
        const response = yield (0, supertest_1.default)(app_1.app).get('/producers/winners/intervals');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('min');
        expect(response.body).toHaveProperty('max');
        const { min, max } = response.body;
        expect(min).toBeInstanceOf(Array);
        expect(max).toBeInstanceOf(Array);
        expect(min.length).toBe(0);
        expect(max.length).toBe(0);
    }));
});
