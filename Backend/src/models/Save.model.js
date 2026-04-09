import mongoose ,{Schema} from "mongoose";
const saveschema = new Schema(
    {
        user : {
            type:mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true,
        },
        food : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "FoodModel"
        }
    },
    {timestamps:true}
)
export const Save=mongoose.model("Save",saveschema);