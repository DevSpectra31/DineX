import { FoodModel } from "../models/Foodmodel.js";
import { AuthFoodPartnerMiddleware  } from "../Middlewares/auth.middleware.js";

//createFood
async function CreateFood(req,res){
    //foodpartner
    console.log(req.foodPartner);
    //body
    console.log(req.body);
    console.log(req.file)
    res.send("food item is created")

}


export{CreateFood}