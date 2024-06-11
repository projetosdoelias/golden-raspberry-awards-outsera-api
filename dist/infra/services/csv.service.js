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
exports.CSVService = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const movie_entity_1 = require("../../domain/entities/movie.entity");
const data_source_1 = __importDefault(require("../../infra/database/data-source"));
class CSVService {
    static loadMovies() {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.resolve(__dirname, '../../../data/movielist.csv');
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            const movies = [];
            yield new Promise((resolve, reject) => {
                (0, csv_parse_1.parse)(fileContent, {
                    delimiter: ';',
                    columns: true,
                    trim: true
                }, (err, records) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        records.forEach(record => {
                            if (record.winner === 'yes') {
                                movies.push({
                                    year: parseInt(record.year, 10),
                                    title: record.title,
                                    studios: record.studios,
                                    producers: record.producers,
                                    winner: true,
                                });
                            }
                        });
                        resolve();
                    }
                });
            });
            const movieRepository = data_source_1.default.getRepository(movie_entity_1.Movie);
            yield movieRepository.clear();
            yield movieRepository.save(movies); // Insere os novos registros
        });
    }
}
exports.CSVService = CSVService;
