import cloudinary from "../lib/Cloudinary.js";
import message from "../models/messageModel.js";
import Usermodel from "../models/Usermodel.js";
import {io,userSocketMap} from '../server.js'

export const getusersforsidebar=async(req,res)=>{
    try{
          const userId=req.user._id
        const filteredusers=await Usermodel.find({_id:{$ne:userId}}).select('-password')
        const unseenmsg={}    
        const promises=filteredusers.map(async(user)=>{
            const messages=await message.find({senderId:user._id,recieverId:userId,seen:false})
            if(messages.length>0){
                unseenmsg[user._id] = messages.length;

                
            }
        })
        await Promise.all(promises)
        return res.json({success:true,users:filteredusers,unseenmsg})
    }
    catch(error){
        console.log(error)
        return res.json({success:false,message:'error'})
    

    }
  
}


export const getMessage=async(req,res)=>{
    const {id:selectedUser}=req.params
    const myId=req.user._id
    try{
        const messageofuser=await message.find({
            $or:[
                {senderId:myId,recieverId:selectedUser},
                {senderId:selectedUser,recieverId:myId}
            ]
        })
        await message.updateMany({senderId:selectedUser,recieverId:myId},{seen:true})
        return res.json({success:true,messages:messageofuser})
    }
    catch(error){
        console.log(error)
        return res.json({success:false})
    

    }
}

export const markmsgSeen=async(req,res)=>{
    try{
         const {id}=req.params
        await message.findByIdAndUpdate(id,{seen:true})
        return res.json({success:true,message:'success'})

    }
    catch(error){
        console.log(error)
        return res.json({success:false})
    

    }


}

export  const sendmsg=async(req,res)=>{
    try{
          const {text,image}=req.body
          const senderId = req.user._id;
        const recieverId = req.params.id;

        let img_url;
        if(image){
          
            const upload_response=await cloudinary.uploader.upload(image)
            img_url=upload_response.secure_url
        }
        const newmessage=await message.create({
            senderId,
            recieverId,
            text,
            image:img_url,

        })
        const recieverSocketId=userSocketMap[recieverId]
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newmessage',newmessage)
        }
        return res.json({success:true,newmessage})

    }
    catch(error){
        console.log(error)
        return res.json({success:false})
    

    }
  

}