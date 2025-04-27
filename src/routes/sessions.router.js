import { Router } from 'express';
import { passportCall } from '../utils.js';
import { SessionsController } from '../controllers/sessions.controller.js';

export const router = Router();

//* Register - Local Strategy *************************************************
router.post('/register', passportCall('register'), SessionsController.register);

//* Login - Local Strategy ****************************************************
router.post('/login', passportCall('login'), SessionsController.login);

//* Current - *****************************************************************
// passport.authenticate('current', { session: false }),
router.get('/current', passportCall('current'), SessionsController.current);

//* Logout - ******************************************************************
router.post('/logout', SessionsController.logout);

//* Error -  *****************************************************************
router.get('/error', SessionsController.error);
