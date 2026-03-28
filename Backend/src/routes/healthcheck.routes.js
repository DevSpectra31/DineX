import express from "express";

const app =express.Router();

app.get("/",(req,res)=>{
    res.send(`health route in running`);
})

export default app;