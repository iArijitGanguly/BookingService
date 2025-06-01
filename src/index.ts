import express from 'express';

import { serverConfig } from './configs/server.config';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import apiRouter from './routes';

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
    console.log(`Server is running on http://localhost:${serverConfig.PORT}`);
});