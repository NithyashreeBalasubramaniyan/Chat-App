import  express from 'express'
import http from 'http'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './lib/Db.js'
import userroute from './routes/userRoutes.js'
import msgroute from './routes/messageroutes.js'
import { Server } from 'socket.io'

const app=new express()
const server=http.createServer(app)

export const io=new Server(server,{
    cors:{origin:'*'}
})

export const userSocketMap={}

io.on('connection',(socket)=>{
        const userId=socket.handshake.query.userId
        console.log('user connected:',userId)
        if(userId)userSocketMap[userId]=socket.id
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
        socket.on('disconnect',()=>{
            console.log('user disconnected:',userId)
            delete userSocketMap[userId]
            io.emit('getOnlineUsers',Object.keys(userSocketMap))
        })
})




app.use(express.json({limit:'4mb'}))
app.use(cors())

connectDB()

app.use('/api/auth',userroute)
app.use('/api/messages',msgroute)

app.get('/api/status',(req,res)=>{
    return res.send('server running successfully')
})


if(process.env.NODE_ENV !=='production'){
const port=process.env.PORT || 5000;
server.listen(port,()=>{
    console.log('server is running at port',port)
})
    
}
export default server;

