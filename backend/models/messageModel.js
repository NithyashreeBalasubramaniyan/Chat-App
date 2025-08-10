import Usermodel from './Usermodel.js'
import mongoose from 'mongoose'

const messageSchema=new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:'Usermodel',required:true},
    recieverId:{type:mongoose.Schema.Types.ObjectId,ref:'Usermodel',required:true},
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}
},{timestamps:true})

const message=mongoose.model('message',messageSchema)
export default message