import { Router } from "express";
import { createNewUser, getUserProfile } from "./user.controller.js";
import { authenticateUser } from "../../middlewares/jwt.middleware.js";
import { authorizePermission } from "../../middlewares/authorizePermission.middleware.js";

const userRouter = Router();

userRouter.get('/profile', getUserProfile);
userRouter.post('/new', authenticateUser, authorizePermission('user.create'), createNewUser);

export default userRouter;