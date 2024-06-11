import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "../../domain/entities/movie.entity";

const isTest = process.env.NODE_ENV === 'test';

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: isTest ? ':memory:' : 'database.sqlite',
    dropSchema: isTest,
    synchronize: true,
    logging: false,
    entities: [Movie],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;
