import { Router } from "express";
import { newTenantController } from "./tenant.controller.js";
import { resolveTenant } from "../../middlewares/resolve.tenant.middleware.js";
import { authenticateUser } from "../../middlewares/jwt.middleware.js";

const tenantRouter = Router();

tenantRouter.post('/new', resolveTenant, authenticateUser, newTenantController);

export default tenantRouter;