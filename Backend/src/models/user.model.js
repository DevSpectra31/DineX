import mongoose ,{Schema} from "mongoose";

const userSchema = new Schema(
    {
        Username : {
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password : {
            type:String,
        }
    },
    {timestamps:true}
)
export const User=mongoose.model("User",userSchema);