import { FoodModel } from "../models/Foodmodel.js";
import jwt from "jsonwebtoken";
import { FoodPartner } from "../models/FoodPartner.js";
import { User } from "../models/user.model.js";


async function AuthFoodPartnerMiddleware(req,res,next){
    const token = req.cookies.token 
    //console.log("token : " ,token)
    if(!token){
        return res.status(401).json({
            message : "Please login first"
        })
    }
    try {
        const decodedtoken= jwt.verify(token,process.env.JWT_SECRET)
        //console.log("decodedtoken : " ,decodedtoken)
        const foodPartner=await FoodPartner.findById(decodedtoken._id).select("-password");
        //console.log("foodPartner : " ,foodPartner )
        if(!foodPartner){
            return res.status(401).json({
                message :" food partner not exist"
            })
        }
        req.foodPartner=foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

async function AuthUserMiddleware(req,res,next){
     const token = req.cookies.token 
    //console.log("token : " ,token)
    if(!token){
        return res.status(401).json({
            message : "Please login first"
        })
    }
    try {
        const decodedtoken= jwt.verify(token,process.env.JWT_SECRET)
        //console.log(decodedtoken)
        const loggeduser=await User.findById(decodedtoken._id).select("-password");
        //console.log("loggeduser : ",loggeduser)
        if(!loggeduser){
            return res.status(401).json({
                message : "user not found"
            })
        }
        req.user=loggeduser
        next();
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

export{AuthFoodPartnerMiddleware,AuthUserMiddleware};
