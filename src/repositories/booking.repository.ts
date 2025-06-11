import { IdempotencyKey, Prisma } from '@prisma/client';
import { validate as isValidUUID } from 'uuid';

import prismaClient from '../prisma/client';
import { IdempotencyRawQueryResponse } from '../types/rawQueryResponseIdempotencyKey';
import { BadRequestError, NotFoundError } from '../utils/errors/app.error';

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prismaClient.booking.create({
        data: bookingInput
    });

    return booking;
}

export async function createIdempotencyKey(idemKey: string, bookingId: number) {
    const idempotencyKey = await prismaClient.idempotencyKey.create({
        data: {
            idemKey,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    });

    return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(tx: Prisma.TransactionClient, key: string) {
    if(!isValidUUID(key)) {
        throw new BadRequestError('Invalid idempotency key format');
    }
    
    const idempotencyKey = await tx.$queryRaw<IdempotencyRawQueryResponse[]>(
        Prisma.sql`SELECT * FROM idempotency_keys WHERE idem_key = ${key} LIMIT 1 FOR UPDATE;`
    );

    if(!idempotencyKey || idempotencyKey.length == 0) {
        throw new NotFoundError('Idempotency Key is not found');
    }

    const raw = idempotencyKey[0];
    
    const idempotencyKeyData: IdempotencyKey = {
        id: raw.id,
        idemKey: raw.idem_key,
        bookingId: raw.booking_id,
        finalized: !!raw.finalized,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at
    };

    return idempotencyKeyData;
}

export async function getBookingById(bookingId: number) {
    const booking = await prismaClient.booking.findUnique({
        where: {
            id: bookingId
        }
    });

    return booking;
}

export async function confirmBooking(tx: Prisma.TransactionClient, bookingId: number) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: 'CONFIRMED'
        }
    });

    return booking;
}

export async function cancelBooking(tx: Prisma.TransactionClient, bookingId: number) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: 'CANCELLED'
        }
    });

    return booking;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, idemKey: string) {
    const idempotencyKey = await tx.idempotencyKey.update({
        where: {
            idemKey
        },
        data: {
            finalized: true
        }
    });

    return idempotencyKey;
}