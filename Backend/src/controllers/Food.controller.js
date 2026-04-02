import { FoodModel } from "../models/Foodmodel.js";
import { AuthFoodPartnerMiddleware  } from "../Middlewares/auth.middleware.js";
import {uploadFile} from "../services/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import path from "path";

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
            foodPartner:req.foodPartner._id || null,
        })
        return res.status(201).json({
            message : "food item created",
            food:fooditem,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating food item",
            error: error.message
        })
    }
}

async function GetFoodItem(req,res){
    const fooditems= await FoodModel.find({});
    res.status(201).json({
        message:"Food items fetched suceessfully",
        fooditems,
    })
}


export{CreateFood,GetFoodItem}
