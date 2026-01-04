import { Router } from "express";
import { getUserProfile } from "./user.controller.js";

const userRouter = Router();

userRouter.get('/profile', getUserProfile);

export default userRouter;