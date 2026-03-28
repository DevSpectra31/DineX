import mongoose , {Schema} from "mongoose";

const FoodPartnerSchema= new Schema(
    {
        name : {
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,  
        },
        password:{
            type:String,
            required:true,
            unique:true,
        }

    }
)
export const FoodPartner=mongoose.model("FoodPartner",FoodPartnerSchema)