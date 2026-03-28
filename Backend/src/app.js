// create server
import express from "express";
import cookieparser from "cookie-parser"
const app=express();

//middleware
app.use(express.json());
app.use(cookieparser());

//import routes
import Healthcheckroute from "./routes/healthcheck.routes.js";
import UserRoute from "./routes/user.routes.js";

//use routes
app.use("/api/v1/healthcheck",Healthcheckroute);
app.use("/api/v1/users/",UserRoute)

export default app;