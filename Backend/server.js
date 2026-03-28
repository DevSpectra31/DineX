// start server
import dotenv from "dotenv";
dotenv.config({path:".env"})
import connectDb from "./src/db/db.js";
import app from "./src/app.js"
const port = process.env.PORT || 3000;
connectDb();
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})