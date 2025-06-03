import express from 'express';

import logger from './configs/logger.config';
import { serverConfig } from './configs/server.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import apiRouter from './routes';

const app = express();


app.use(express.json());

app.use(attachCorrelationIdMiddleware);

app.use('/api', apiRouter);

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
});