import { FoodModel } from "../models/Foodmodel.js";
import { AuthFoodPartnerMiddleware  } from "../Middlewares/auth.middleware.js";
import { getSignedFileUrl, resolveFilePath, uploadFile } from "../services/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { Likes } from "../models/Likes.model.js";
import { Save } from "../models/Save.model.js";
const mimeExtensionMap = {
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/ogg": ".ogv",
    "video/quicktime": ".mov",
    "video/x-msvideo": ".avi",
    "video/x-matroska": ".mkv",
};

function getUploadFileName(file) {
    const originalExtension = path.extname(file?.originalname || "");
    const fallbackExtension = mimeExtensionMap[file?.mimetype] || "";
    const extension = originalExtension || fallbackExtension;

    return `${uuidv4()}${extension}`;
}
//createFood
async function CreateFood(req,res){
    try {
        //body
        // console.log(req.foodPartner)
        // console.log(req.body);
        // console.log(req.file)

        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required",
            })
        }

        if (!req.file.mimetype?.startsWith("video/")) {
            return res.status(400).json({
                message: "Only video uploads are supported",
            })
        }

        const fileuploadResult = await uploadFile(
            req.file.buffer,
            getUploadFileName(req.file)
        )
        //console.log(fileuploadResult)
        const fooditem = await FoodModel.create({
            name:req.body.name,
            description:req.body.description,
            video:fileuploadResult.url,
            videoFilePath:fileuploadResult.filePath,
            foodPartner:req.foodPartner._id || null,
        })
        return res.status(201).json({
            message : "food item created",
            food:{
                ...fooditem.toObject(),
                video:getSignedFileUrl({
                    filePath: fileuploadResult.filePath,
                    fileUrl: fileuploadResult.url,
                }),
            },
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating food item",
            error: error.message
        })
    }
}

async function GetFoodItem(req,res){
    const fooditems= await FoodModel.find({}).lean();
    const signedFoodItems = fooditems.map((item) => ({
        ...item,
        video: getSignedFileUrl({
            filePath: item.videoFilePath || resolveFilePath(null, item.video),
            fileUrl: item.video,
        }),
    }));

    res.status(200).json({
        message:"Food items fetched suceessfully",
        fooditems:signedFoodItems,
    })
}
async function likeFood(req,res){
    const foodId = req.body?.foodId;
    const user = req.user;
    //console.log(foodId);

    if (!foodId) {
        return res.status(400).json({
            message: "foodId is required",
        })
    }

    const foodalreadylike= await Likes.findOne({
        user: user._id,
        food:foodId,
    })
    if(foodalreadylike){
        await Likes.deleteOne({
        user: user._id,
        food:foodId
    })
    await FoodModel.findByIdAndUpdate(foodId,{
        $inc : {likeCount:-1}
    })
    return res.status(200).json({
        message: "Food unliked successfully",
        action:"unliked",
    })
}
const like = await Likes.create({
    user : user._id,
    food:foodId
})
await FoodModel.findByIdAndUpdate(foodId,{
    $inc : {likeCount:1}
})
return res.status(201).json({
    message:"food liked successfully",
    action:"liked",
})
}
async function SaveFood(req,res){
      const foodId = req.body?.foodId || req.body?.foodid;
    const user = req.user;
    if (!foodId) {
        return res.status(400).json({
            message: "foodId is required",
        })
    }

    const isAlreadySaved = await Save.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await Save.deleteOne({
            user: user._id,
            food: foodId
        })

        await FoodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await Save.create({
        user: user._id,
        food: foodId
    })

    await FoodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })
}
export{CreateFood,GetFoodItem,likeFood,SaveFood}
