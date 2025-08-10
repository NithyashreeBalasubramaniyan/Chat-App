import express from 'express'
import authMethod from '../middleware/Auth.js'
import { checkauth, loginUser, registerUser, updateUser } from '../controller/userController.js'
const userroute=express.Router()
userroute.post('/register',registerUser)
userroute.post('/login',loginUser)
userroute.get('/check',authMethod,checkauth)
userroute.post('/update-profile',authMethod,updateUser)

export default userroute