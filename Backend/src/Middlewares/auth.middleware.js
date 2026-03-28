import { FoodModel } from "../models/Foodmodel.js";
import jwt from "jsonwebtoken";
import { FoodPartner } from "../models/FoodPartner.js";


async function AuthFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.token;
    //console.log("token : " ,token)
    if(!token){
        res.status(401).json({
            message : "Please login first"
        })
    }
    try {
        const decodedtoken= jwt.verify(token,process.env.JWT_SECRET)
        //console.log("decodedtoken : " ,decodedtoken)
        const foodPartner=await FoodPartner.findById(decodedtoken.id).select("-password");
        //console.log("foodPartner : " ,foodPartner )
        req.foodPartner=foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}



export{AuthFoodPartnerMiddleware};