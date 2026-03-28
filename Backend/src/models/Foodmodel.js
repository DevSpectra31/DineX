import mongoose ,{Schema} from "mongoose";
import { FoodPartner } from "./FoodPartner.js";
const foodSchema = new Schema(
    {
        name:{
            type:String,
            required:true,  
        },
        video:{
            type:String,
            required:true,
        },
        description:{
            type:String,
        },
        foodPartner : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"FoodPartner",
        }
    }
)
export const FoodModel=mongoose.model("FoodModel",foodSchema);