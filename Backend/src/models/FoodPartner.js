import mongoose , {Schema} from "mongoose";

const FoodPartnerSchema= new Schema(
    {
        BusinessName : {
            type:String,
        },
        OwnerName:{
            type:String,
            required:true,
        },
        BusinessType:{
            type:String,
            enum:["Cafe","Kitchen","Resturant","CLoud Kitchen","other"],
        },
        email:{
            type:String,
            required:true,
            unique:true,  
        },
        PhoneNumber:{
            type:String,
            required:true,
        },
        BusinessAddress:{
            type:String,
            required:true,
        },
        City:{
            type:String,
            required:true,
        },
        ZipCode:{
            type:Number,
            required:true,
        },
        GSTIN:{
            type:String,
        },
        LicenseNumber:{
            type:Number,
        },
        password:{
            type:String,
            required:true,
            unique:true,
        },

    }
)
export const FoodPartner=mongoose.model("FoodPartner",FoodPartnerSchema)