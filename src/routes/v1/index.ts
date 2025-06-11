import express from 'express';

import bookingRouter from './booking.route';
import pingRouter from './ping.route';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);

v1Router.use('/bookings', bookingRouter);

export default v1Router;