import express from "express";
import { AuthFoodPartnerMiddleware, AuthUserMiddleware } from "../Middlewares/auth.middleware.js";
import { CreateFood ,GetFoodItem ,likeFood, SaveFood ,getSavefood} from "../controllers/Food.controller.js";
import multer from "multer";

const app =express.Router();

const upload = multer({
    storage:multer.memoryStorage(),
})
//protected API
app.post('food-parter/create-food', AuthFoodPartnerMiddleware, upload.single("video"), CreateFood);
app.get('/',AuthUserMiddleware, GetFoodItem)
app.post('/likes',AuthUserMiddleware,likeFood)
app.post('/save',AuthUserMiddleware,SaveFood)
app.get("/saved",AuthUserMiddleware,getSavefood)

export default app;
