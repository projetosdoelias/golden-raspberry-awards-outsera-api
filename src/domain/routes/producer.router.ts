import { Request, Response, Router } from 'express';
import { ProducerController } from '../controllers/producer.controller';

const producerRouter = Router();
const producerController = new ProducerController();

producerRouter.get('/winners/intervals', (req: Request, res: Response) => {
  producerController.getProducerWinIntervals(req, res);
});

producerRouter.get('/',(req: Request, res: Response) => {
  res.json(`Hello World! This is an API about the Golden Raspberry Awards`)

} )
export default producerRouter;