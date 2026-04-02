import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import cookie from  "cookie-parser"
import { FoodPartner } from "../models/FoodPartner.js";
//user
async function registerUser(req,res){
   try {
     const {fullName,email,password}=req.body;
     const existeduser = await User.findOne({email});
 
     if(existeduser){
         return res.status(400).json({
             message:"User already exist with same email",
         })
     }
     //hash  password
     const hashedpassword = await bcrypt.hash(password,12);
     const user=await User.create({
         fullName,
         email,
         password:hashedpassword,
     })
     // generate the token
     const token = jwt.sign({
         id:user._id,
     },process.env.JWT_SECRET)
     res.cookie("token",token);
     res.status(201).json({
         message:"User registerd successfully",
         user:{
             _id:user._id,
             email:user.email,
             fullName:user.fullName
         }
     })
   } catch ( error) {
    return res.status(500).json({
        message:error.message,
    })
   }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email);
    console.log(password)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "invalid email or password"
      });
    }

    const ispasswordcorrect = await bcrypt.compare(password, user.password);

    if (!ispasswordcorrect) {
      return res.status(400).json({
        message: "password not correct",
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET
    );
     res.cookie("token",token)
    return res.status(200).json({
      message: "user successfully logged in",
      user: {
        _id: user._id,
        email: user.email,
        Username:user.Username,
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function logoutUser(req, res){
    res.clearCookie("token");
    res.status(201).json({
        message:"user logout successfully"
    })
}

//FoodPartner
async function registerFoodParnter(req,res){
   try {
     const {OwnerName,BusinessName,email,password,PhoneNumber,BusinessAddress,City,ZipCode}=req.body;
     const existedpartner = await FoodPartner.findOne({email});
 
     if(existedpartner){
         return res.status(400).json({
             message:"Food Partner already exist with same email",
         })
     }
     //hash  password
     const hashedpassword = await bcrypt.hash(password,12);
     const partner=await FoodPartner.create({
      OwnerName,
      BusinessName,
      email,
      password:hashedpassword,
      PhoneNumber,
      BusinessAddress,
      City,
      ZipCode,
     })
     // generate the token
     const token = jwt.sign({
         _id:partner._id,
     },process.env.JWT_SECRET)
     res.cookie("token",token);
     res.status(201).json({
         message:"Food Partner registerd successfully",
         partner:{
             _id:partner._id,
             email:partner.email,
             BusinessName:partner.BusinessName,
             OwnerName:partner.OwnerName,
             BusinessAddress:partner.BusinessAddress,
             PhoneNumber:partner.PhoneNumber,
             City:partner.City,
             ZipCode:partner.ZipCode,

         }
     })
   } catch ( error) {
    return res.status(500).json({
        message:error.message,
    })
   }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const partner = await FoodPartner.findOne({ email });

    if (!partner) {
      return res.status(401).json({
        message: "invalid email or password"
      });
    }

    const ispasswordcorrect = await bcrypt.compare(password, partner.password);

    if (!ispasswordcorrect) {
      return res.status(400).json({
        message: "password not correct",
      });
    }

    const token = jwt.sign(
      { _id: partner._id },
      process.env.JWT_SECRET
    );
    res.cookie("token",token)
    return res.status(200).json({
      message: "FoodPartner successfully logged in",
      partner: {
        _id: partner._id,
        BusinessName:partner.BusinessName,
        email: partner.email,
        OwnerName:partner.OwnerName,
        PhoneNumber:partner.PhoneNumber,
        BusinessAddress:partner.BusinessAddress,
        City:partner.City,
        ZipCode:partner.ZipCode,
        
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function logoutFoodPartner(req, res){
    res.clearCookie("token");
    res.status(201).json({
        message:"FoodPartner logout successfully",

    })
}
export{registerUser,loginUser ,logoutUser,registerFoodParnter,loginFoodPartner,logoutFoodPartner}