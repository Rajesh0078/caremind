import { Router } from 'express';
import { loginController, registerController } from './auth.controller.js';
import { resolveTenant } from '../../middlewares/resolve.tenant.middleware.js';
import { authenticateUser } from '../../middlewares/jwt.middleware.js';

const authRouter = Router();

authRouter.post('/login', resolveTenant, loginController);
authRouter.post('/register', resolveTenant, authenticateUser, registerController);

export default authRouter;