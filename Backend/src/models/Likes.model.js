import mongoose , {Schema} from "mongoose";
const likeschema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    food : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"FoodModel",
        required:true,
    }
},{
    timestamps:true,
})
export const Likes= mongoose.model("Likes",likeschema)