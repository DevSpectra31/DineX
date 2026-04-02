import express from "express";
import { AuthFoodPartnerMiddleware } from "../Middlewares/auth.middleware.js";
import { getFoodPartnerById, getMyFoodPartner } from "../controllers/FoodPartner.controller.js";
const app =express.Router();

app.get("/me", AuthFoodPartnerMiddleware, getMyFoodPartner)
app.get("/:id", AuthFoodPartnerMiddleware, getFoodPartnerById)

export default app;
