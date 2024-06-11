import { Request, Response } from 'express';
import { ProducerService } from '../services/producer.service';

export class ProducerController {

  private service: ProducerService;

  constructor() {
    this.service = new ProducerService(); 
  }

  async getProducerWinIntervals(req: Request, res: Response) {
    try {
      const producersGap = await this.service.getProducerWinIntervals();
      return res.json(producersGap);
    } catch (error) { 
      throw new Error('error while retrieving data from producers intervals')
    } 
  }
}