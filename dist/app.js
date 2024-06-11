"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const producer_router_1 = __importDefault(require("./domain/routes/producer.router"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json(`Hello World! This is an API about the Golden Raspberry Awards by Elias`);
});
app.use('/producers', producer_router_1.default);
