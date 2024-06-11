import { Repository } from "typeorm";
import { Movie } from "../entities/movie.entity";
import AppDataSource from "../../infra/database/data-source";


export interface IntervalResult {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
} 

interface ProducerIntervals {
  min: IntervalResult[];
  max: IntervalResult[];
}

export class ProducerService {

  private movieRepository: Repository<Movie>;

  constructor() {
    this.movieRepository = AppDataSource.getRepository(Movie);
  }

  async getProducerWinIntervals(): Promise<ProducerIntervals> {

    // Trago apenas os vencedores
    const movies = await this.movieRepository.find({ where: { winner: true } });

    // Defino um objeto para armazenar os vencedores e os anos aos quais ele venceu
    const producerWins: { [key: string]: number[] } = {};
    
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

    const intervals: IntervalResult[] = [];

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
  }
  
}