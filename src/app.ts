import express from 'express';
import producerRouter from './domain/routes/producer.router';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.json(`Hello World! This is an API about the Golden Raspberry Awards by Elias`);
});
app.use('/producers', producerRouter);

export { app }; 