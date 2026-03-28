import express from "express";
import { AuthFoodPartnerMiddleware } from "../Middlewares/auth.middleware.js";
import { CreateFood } from "../controllers/Food.controller.js";
import multer from "multer";
const app =express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
})
//protected API
app.post('/',AuthFoodPartnerMiddleware,upload.single("video"),CreateFood);



export default app;