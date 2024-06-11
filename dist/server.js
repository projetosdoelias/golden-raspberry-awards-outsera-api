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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const data_source_1 = __importDefault(require("./infra/database/data-source"));
const csv_service_1 = require("./infra/services/csv.service");
const app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
const port = process.env.PORT || 3000;
data_source_1.default.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield csv_service_1.CSVService.loadMovies();
    app_1.app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}))
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
