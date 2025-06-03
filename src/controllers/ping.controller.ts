import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../configs/logger.config';

export function pingHandler(_req: Request, res: Response) {
    logger.info('Succesfully raised the request');
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Pong'
    });
}