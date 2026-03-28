import express from "express";
import { registerUser ,loginUser ,logoutUser ,registerFoodParnter ,loginFoodPartner ,logoutFoodPartner } from "../controllers/user.controller.js";
import { FoodPartner } from "../models/FoodPartner.js";
const app = express.Router();

//users auth api
app.post("/register",registerUser)
app.post("/login",loginUser)
app.get("/logout",logoutUser);
//partners auth api
app.post("/regsiterPartner",registerFoodParnter)
app.post("/loginPartner",loginFoodPartner)
app.get("/logoutpartner",logoutFoodPartner)

export default app;