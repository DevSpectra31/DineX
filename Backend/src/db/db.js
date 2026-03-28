import mongoose from "mongoose";
function connectDb(){
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"DineX",
    })
      .then(()=>{
        console.log("MongoDB connected")
      })
      .catch((err)=>{
        console.log("MongoDb connection failed")
      })
}
export default connectDb;