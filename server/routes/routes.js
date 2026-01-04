import { Router } from 'express';
import authRouter from '../modules/auth/auth.routes.js';
import userRouter from '../modules/users/user.routes.js';
import tenantRouter from '../modules/tenants/tenant.routes.js';

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime()
  });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/tenants', tenantRouter);

export default router;