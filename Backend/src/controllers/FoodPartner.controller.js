import { FoodPartner } from "../models/FoodPartner.js";
import { FoodModel } from "../models/Foodmodel.js";
async function getFoodPartnerById(req,res){
   try {
     const foodPartnerId = req.params.id;
     const foodPartner = await FoodPartner.findById(foodPartnerId)
     const foodItemsByFoodPartner=await FoodModel.find({foodPartner:foodPartnerId})
 
     if(!foodPartner){
         return res.status(404).json({message : "food partner not found"});
     }
     res.status(201).json({
         message: "food partner retrieved successfully",
         foodPartner : {
             ...foodPartner.toObject(),
             foodItems:foodItemsByFoodPartner,
         }
     })
   } catch (error) {
    message : error.message
   }
}
async function getMyFoodPartner(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(401).json({ message: "Please login first" });
        }
        const foodPartnerId = req.foodPartner._id;
        const foodItemsByFoodPartner = await FoodModel.find({ foodPartner: foodPartnerId });
        res.status(200).json({
            message: "food partner retrieved successfully",
            foodPartner: {
                ...req.foodPartner.toObject(),
                foodItems: foodItemsByFoodPartner,
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export {getFoodPartnerById, getMyFoodPartner}
