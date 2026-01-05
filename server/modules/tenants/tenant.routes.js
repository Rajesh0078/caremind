import { Router } from "express";
import { getTenantsController, newTenantController } from "./tenant.controller.js";
import { authenticateUser } from "../../middlewares/jwt.middleware.js";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware.js";

const tenantRouter = Router();

tenantRouter.get('/', authenticateUser, authorizeRole('super_admin'), getTenantsController);
tenantRouter.post('/new', authenticateUser, authorizeRole("super_admin"), newTenantController);


export default tenantRouter;