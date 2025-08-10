import { createContext, useEffect, useState } from "react"

import {io} from 'socket.io-client'
import axios from 'axios'
import toast from "react-hot-toast"

const backend_url = import.meta.env.VITE_BACKEND_URL 

export const Authcontext=createContext()




export const Authprovider=({children})=>{
    axios.defaults.baseURL=backend_url
    const [token,setToken]=useState(localStorage.getItem('token'))
    const [authUser,setAuthUser]=useState(null)
    const [onlineUser,setOnlineUser]=useState([])
    const [socket,setSocket]=useState(null)

    const checkAuth = async()=>{
        try{
            const { data }=await axios.get("/api/auth/check")
            if(data.success)
            {
                setAuthUser(data.user)
                connectSocket(data.user)

            }
        }
        catch(error){
            toast.error(error.message)
         }

    }

    const connectSocket=(userData)=>{
        if(!userData||socket?.connected) return;
        const newsocket=io(backend_url,{
            query:{
                userId:userData._id,
            }
        })
        newsocket.connect()
        setSocket(newsocket)
        newsocket.on('getOnlineUsers',(userIds)=>{
            setOnlineUser(userIds)
        })
    }

    const login=async(state,credential)=>{
        try{
            const {data}=await axios.post(`/api/auth/${state}`,credential)
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
                axios.defaults.headers.common['token']=data.token
                localStorage.setItem('token', data.token)
                setToken(data.token) 

                toast.success(data.message) 
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }

    const logout=async()=>{
        localStorage.removeItem('token')
        setToken(null)
        setAuthUser(null)
        setOnlineUser([])
        axios.defaults.headers.common['token']=null
        toast.success('logout successsfully')
        socket.disconnect();
        
    }

    const updateProfile=async(body)=>{
        try{
            const {data}=await axios.post('/api/auth/update-profile',body)
            if(data.success){
                setAuthUser(data.user)
                toast.success(data.message)
                checkAuth()
                
            }
        }
        catch(error){
            toast.error(error.message)
        }
    
    }

   useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
        setToken(savedToken);
        axios.defaults.headers.common['token'] = savedToken;
        checkAuth(); // ✅ call it here
    }
}, []);



const value={
    axios,
    checkAuth,
    login,
    logout,
    updateProfile,
    authUser,
    setAuthUser,
    token,
    setToken,
    onlineUser,
    socket, // ✅ ADD THIS
}


return(
    <Authcontext.Provider value={value}>
        {children}
    </Authcontext.Provider>
)

}