import express from "express";
import { AuthFoodPartnerMiddleware, AuthUserMiddleware } from "../Middlewares/auth.middleware.js";
import { CreateFood ,GetFoodItem ,likeFood, SaveFood } from "../controllers/Food.controller.js";
import multer from "multer";
const app =express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
})
//protected API
app.post('/', AuthFoodPartnerMiddleware, upload.single("video"), CreateFood);
app.get('/', GetFoodItem)
app.post('/likes',AuthUserMiddleware,likeFood)
app.post('/save',AuthUserMiddleware,SaveFood)

export default app;
