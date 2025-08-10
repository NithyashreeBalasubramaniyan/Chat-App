import { raw } from "express";
import { gentoken } from "../lib/utils.js";
import Usermodel from "../models/Usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cloudinary from "../lib/Cloudinary.js";
const registerUser=async(req,res)=>{
    const {name,email,password,bio}=req.body
    try{
        const exist=await Usermodel.findOne({email})
        if(exist){
            return res.json({success:false,message:'user already exists'})
        }
        else{
            if(!name||!email||!password||!bio){
                return res.json({success:false,message:'data missing'})
            }
            const salt=await  bcrypt.genSalt(10)
            const hashedpassword=await bcrypt.hash(password,salt)
            const newuser=await Usermodel.create({
                name:name,
                email:email,
                password:hashedpassword,
                bio:bio,
            })
            const token = gentoken(newuser._id)
            return res.json({success:true,user:newuser,token,message:'user signed'})

        }
    }
    catch(error){
        console.log(error)
        return res.json({success:false,message:error.message})
    }
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body
    try{

        const exist=await Usermodel.findOne({email})
        if(!exist){
            return res.json({success:false,message:'user doesnt exists'})
        }
        else{
            const isMatch=await bcrypt.compare(password,exist.password)
            if(!isMatch){
                return res.json({success:false,message:'incorrect credentials'})
            }
            const token = gentoken(exist._id) 

            return res.json({success:true,user:exist,token,message:'login successfully'})
        }
    }
    catch(error){
        console.log(error)
        return res.json({success:false,message:error.message})
    }
  


}
const checkauth=(req,res)=>{
    return res.json({success:true,user:req.user})
}

const updateUser=async(req,res)=>{
    let updateduser;
    try{
          const {profilePic,bio,name}=req.body
            const userId=req.user._id
            if(!profilePic) {
            updateduser= await Usermodel.findByIdAndUpdate(userId,{name,bio},{new:true})
            }  
            else{
                const upload=await cloudinary.uploader.upload(profilePic)
                updateduser=await Usermodel.findByIdAndUpdate(userId,{name,bio,profilePic:upload.secure_url},{new:true})
            }
            return res.json({success:true,user:updateduser})

    }
    catch(error){
        console.log(error)
        return res.json({success:false,message:'error'})
    }
    
  

}



export {registerUser,loginUser,updateUser,checkauth}