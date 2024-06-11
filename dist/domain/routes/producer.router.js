"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const producer_controller_1 = require("../controllers/producer.controller");
const producerRouter = (0, express_1.Router)();
const producerController = new producer_controller_1.ProducerController();
producerRouter.get('/winners/intervals', (req, res) => {
    producerController.getProducerWinIntervals(req, res);
});
producerRouter.get('/', (req, res) => {
    res.json(`Hello World! This is an API about the Golden Raspberry Awards`);
});
exports.default = producerRouter;
