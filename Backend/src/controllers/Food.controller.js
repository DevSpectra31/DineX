import { FoodModel } from "../models/Foodmodel.js";
import { AuthFoodPartnerMiddleware  } from "../Middlewares/auth.middleware.js";
import {uploadFile} from "../services/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
//createFood
async function CreateFood(req,res){
    //foodpartner
    console.log(req.foodPartner);
    //body
    console.log(req.body);
    console.log(req.file)
    const fileuploadResult = await uploadFile(req.file.buffer,uuidv4())
    //console.log(fileuploadResult)
    const fooditem = await FoodModel.create({
        name:req.body.name,
        description:req.body.description,
        video:fileuploadResult.url,
        foodPartner:req.foodPartner._id,
    })
    return res.status(201).json({
        message : "food item created",
        food:fooditem,
    })
}

async function GetFoodItem(req,res){
    const fooditems= await FoodModel.find({})
    res.status(201).json({
        message:"Food items fetched suceessfully",
        fooditems,
    })
}


export{CreateFood,GetFoodItem}