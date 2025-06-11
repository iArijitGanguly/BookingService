import { CreateBookingDTO } from '../dtos/booking.dto';
import prismaClient from '../prisma/client';
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock } from '../repositories/booking.repository';
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/generateIdempotencyKey';

export async function createBookingService(bookingData: CreateBookingDTO) {
    const booking = await createBooking(bookingData);

    const idemPotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idemPotencyKey, booking.id);

    return {
        bookingId: booking.id,
        reservationId: idemPotencyKey
    };
}

export async function confirmBookingService(idemPotencyKey: string) {
    return await prismaClient.$transaction(async (tx) => {
        const idempotencyKeyData = await getIdempotencyKeyWithLock(tx, idemPotencyKey);

        if(!idempotencyKeyData) {
            throw new NotFoundError('Idempotency Key is not found');
        }

        if(idempotencyKeyData.finalized) {
            throw new BadRequestError('Idempotency key is already finalized');
        }
        
        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, idemPotencyKey);

        return booking;
    });
}