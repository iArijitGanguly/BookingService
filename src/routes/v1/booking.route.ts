import express from 'express';

import bookingController from '../../controllers/booking.controller';
import { validateRequestBody, validateRequestParams } from '../../validators';
import { createBookingSchema, idempotencyKeySchema } from '../../validators/booking.validator';

const bookingRouter = express.Router();

bookingRouter.post('/', validateRequestBody(createBookingSchema), bookingController.createBookingHandler);

bookingRouter.patch('/confirm/:idempotencyKey', validateRequestParams(idempotencyKeySchema), bookingController.confirmBookingHandler);

export default bookingRouter;