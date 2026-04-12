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
        videoFilePath: {
            type: String,
        },
        description:{
            type:String,
        },
        foodPartner : {
            type:mongoose.Schema.Types.ObjectId,
            ref:"FoodPartner",
        },
        likeCount :{
            type:Number,
            default:0,
        },
        savesCount :{
            type:Number,
            default:0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        }
    }
)
export const FoodModel=mongoose.model("FoodModel",foodSchema);
