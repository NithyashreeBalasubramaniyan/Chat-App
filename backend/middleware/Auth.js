import jwt from 'jsonwebtoken'
import Usermodel from '../models/Usermodel.js'
const authMethod=async(req,res,next)=>{
    const token=req.headers.token

    if(!token){
        return res.json({success:false,message:'failed,login again'})
    }
    else{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const   user=await Usermodel.findById(decoded.id).select(-'passeword')
        if(!user){
            return res.json({success:false,message:'error'})
        }
        req.user=user
        next()
       
    }
}
export default authMethod


