import { CreateBookingDTO } from '../dtos/booking.dto';
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from '../repositories/booking.repository';
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
    const idempotencyKeyData = await getIdempotencyKey(idemPotencyKey);

    if(!idempotencyKeyData) {
        throw new NotFoundError('Idempotency Key is not found');
    }

    if(idempotencyKeyData.finalized) {
        throw new BadRequestError('Idempotency key is already finalized');
    }

    const booking = await confirmBooking(idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(idemPotencyKey);

    return booking;
}