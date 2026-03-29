import express from "express";
import { AuthFoodPartnerMiddleware ,AuthUserMiddleware} from "../Middlewares/auth.middleware.js";
import { CreateFood ,GetFoodItem } from "../controllers/Food.controller.js";
import multer from "multer";
const app =express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
})
//protected API
app.post('/',AuthFoodPartnerMiddleware,upload.single("video"),CreateFood);
app.get('/',AuthUserMiddleware,GetFoodItem)



export default app;