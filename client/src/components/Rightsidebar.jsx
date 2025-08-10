import React, { useContext, useEffect, useState } from 'react'
import './Rightsidebar.css'
import assets,{userDummyData,imagesDummyData} from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { Authcontext } from '../../context/AuthContext'
export const Rightsidebar = () => {
  const {selecteduser,messages}=useContext(ChatContext)
 const {logout,onlineUser}=useContext(Authcontext)
 const [imgmsg,setImgmsg]=useState([])
 useEffect(()=>{
   setImgmsg(messages.filter(msg=>msg.image).map(msg=>msg.image))
 },[messages])
  
  return   (
    
       
    
    <div className='right-side-bar'>
      <img className='contact-user-profile' src={selecteduser?.profilePic || assets.avatar_icon} />
      <p className='contact-user-name'>{selecteduser.name}</p>
      <p className='contact-user-bio'>{selecteduser.bio}</p>
      <small>media</small>
      <div className="media">
        {imgmsg.map((img,index)=>{
          return(
            <div key={index} className='media-img-block'>
              <img onClick={()=>window.open(img)} className='media-img' src={img} />
            </div>
          )
        })}
      </div>
      <button onClick={()=>logout()} className='logout-btn'>Log out</button>

    </div>

   )
   
  
}
