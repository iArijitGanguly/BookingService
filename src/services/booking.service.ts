import { redlock } from '../configs/redis.config';
import { serverConfig } from '../configs/server.config';
import { CreateBookingDTO } from '../dtos/booking.dto';
import prismaClient from '../prisma/client';
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock } from '../repositories/booking.repository';
import { BadRequestError, InternalServerError, NotFoundError } from '../utils/errors/app.error';
import { generateIdempotencyKey } from '../utils/generateIdempotencyKey';

export async function createBookingService(bookingData: CreateBookingDTO) {
    const ttl = serverConfig.LOCK_TTL;
    const bookingResource = `hotel:${bookingData.hotelId}`;

    try {
        await redlock.acquire([bookingResource], ttl);
        const booking = await createBooking(bookingData);

        const idemPotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idemPotencyKey, booking.id);

        return {
            bookingId: booking.id,
            reservationId: idemPotencyKey
        };
    } catch {
        throw new InternalServerError('Failed to acquire lock for booking resource');
    }
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