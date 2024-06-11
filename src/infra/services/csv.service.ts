import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { Movie } from '../../domain/entities/movie.entity';
import AppDataSource from '../../infra/database/data-source';

export class CSVService {
  static async loadMovies() {
    const filePath = path.resolve(__dirname, '../../../data/movielist.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const movies: Partial<Movie>[] = [];

    await new Promise<void>((resolve, reject) => {
      parse(fileContent, {
        delimiter: ';',
        columns: true,
        trim: true
      }, (err, records: any[]) => {
        if (err) {
          reject(err);
        } else {
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

    const movieRepository = AppDataSource.getRepository(Movie);
    await movieRepository.clear();  
    await movieRepository.save(movies);  // Insere os novos registros
  }
}