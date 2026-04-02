// create server
import express from "express";
import cookieparser from "cookie-parser"
import cors from "cors"
const app=express();

//middleware
app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

//import routes
import Healthcheckroute from "./routes/healthcheck.routes.js";
import UserRoute from "./routes/user.routes.js";
import FoodRoute from "./routes/Food.route..js";
import FoodPartnerRoute from "./routes/FoodPartner.route.js";
//use routes
app.use("/api/v1/healthcheck",Healthcheckroute);
app.use("/api/v1/users/",UserRoute)
app.use("/api/food/",FoodRoute)
app.use("/api/food-partner/",FoodPartnerRoute)

export default app;
