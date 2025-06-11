import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CreateBookingDTO } from '../dtos/booking.dto';
import { confirmBookingService, createBookingService } from '../services/booking.service';

async function createBookingHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const bookingData: CreateBookingDTO = req.body;
        const response = await createBookingService(bookingData);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Sucessfully created the booking',
            bookingId: response.bookingId,
            reservationId: response.reservationId
        });
    } catch (error) {
        next(error);
    }
}

async function confirmBookingHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const idempotencyKey = req.params.idempotencyKey;
        const response = await confirmBookingService(idempotencyKey);

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Booking is confirmed',
            bookingId: response.id,
            status: response.status
        });
    } catch (error) {
        next(error);
    }
}

export default {
    createBookingHandler,
    confirmBookingHandler
};