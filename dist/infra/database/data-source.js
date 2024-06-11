"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const movie_entity_1 = require("../../domain/entities/movie.entity");
const isTest = process.env.NODE_ENV === 'test';

const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: isTest ? ':memory:' : 'database.sqlite',
    dropSchema: isTest,
    synchronize: true,
    logging: false,
    entities: [movie_entity_1.Movie],
    migrations: [],
    subscribers: [],
});
exports.default = AppDataSource;
