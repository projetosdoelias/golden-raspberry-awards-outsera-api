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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerController = void 0;
const producer_service_1 = require("../services/producer.service");
class ProducerController {
    constructor() {
        this.service = new producer_service_1.ProducerService();
    }
    getProducerWinIntervals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const producersGap = yield this.service.getProducerWinIntervals();
                return res.json(producersGap);
            }
            catch (error) {
                throw new Error('error while retrieving data from producers intervals');
            }
        });
    }
}
exports.ProducerController = ProducerController;
