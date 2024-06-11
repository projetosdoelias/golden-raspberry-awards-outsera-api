import AppDataSource from './infra/database/data-source';
import { CSVService } from './infra/services/csv.service';
import { app } from './app';

const port = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {

        await CSVService.loadMovies();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

export { app }; 