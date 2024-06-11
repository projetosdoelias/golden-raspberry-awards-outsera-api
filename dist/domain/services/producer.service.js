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
exports.ProducerService = void 0;
const movie_entity_1 = require("../entities/movie.entity");
const data_source_1 = __importDefault(require("../../infra/database/data-source"));
class ProducerService {
    constructor() {
        this.movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
    }
    getProducerWinIntervals() {
        return __awaiter(this, void 0, void 0, function* () {
            // Trago apenas os vencedores
            const movies = yield this.movieRepository.find({ where: { winner: true } });
            // Defino um objeto para armazenar os vencedores e os anos aos quais ele venceu
            const producerWins = {};
            // Como alguns filmes tem mais de um produtor, vou percorrer cada um deles e depois popular um array com todos os anos aos quais ele ganhou o premio
            movies.forEach(movie => {
                const producers = movie.producers.split(/,| and /).map(p => p.trim());
                producers.forEach(producer => {
                    if (!producerWins[producer]) {
                        producerWins[producer] = [];
                    }
                    producerWins[producer].push(movie.year);
                });
            });
            const intervals = [];
            // agora vou percorrer cada um deles e calcular o intervalo entre os premios
            for (const producer in producerWins) {
                const wins = producerWins[producer].sort((a, b) => a - b);
                for (let i = 1; i < wins.length; i++) {
                    intervals.push({
                        producer,
                        interval: wins[i] - wins[i - 1],
                        previousWin: wins[i - 1],
                        followingWin: wins[i]
                    });
                }
            }
            // Calculo os intevalos mínimos e máximos
            const minIntervalBetweenWinners = Math.min(...intervals.map(i => i.interval));
            const maxIntervalBetweenWinners = Math.max(...intervals.map(i => i.interval));
            // Agora vou filtrar apenas os produtos que tenham premios dentro dos intervalos mínimos e máximos
            return {
                min: intervals.filter(i => i.interval === minIntervalBetweenWinners),
                max: intervals.filter(i => i.interval === maxIntervalBetweenWinners)
            };
        });
    }
}
exports.ProducerService = ProducerService;
