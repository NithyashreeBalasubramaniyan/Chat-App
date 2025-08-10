import express from 'express'
import authMethod from '../middleware/Auth.js'
import { getMessage, getusersforsidebar, markmsgSeen, sendmsg } from '../controller/messageController.js'
const msgroute=express.Router()

msgroute.get('/users',authMethod,getusersforsidebar)
msgroute.get('/:id',authMethod,getMessage)
msgroute.post('/mark/:id',authMethod,markmsgSeen)
msgroute.post('/send/:id',authMethod,sendmsg)

export default msgroute