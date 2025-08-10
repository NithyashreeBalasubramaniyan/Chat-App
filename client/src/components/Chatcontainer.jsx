import React, { useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();
import './Chatcontainer.css'
import {formatDate} from '../lib/utils'
import assets  from '../assets/assets'
import { useEffect } from 'react'
import { ChatContext } from '../../context/ChatContext';
import { Authcontext } from '../../context/AuthContext';
export const Chatcontainer = () => {
  const {selecteduser,setSelecteduser,setUnseenmessages,messages,getMessage,sendMsg}=useContext(ChatContext)

  const {onlineUser,authUser}=useContext(Authcontext)
 const [input,setInput]=useState('')

 const handletextInput=async(e)=>{
  e.preventDefault()
  if(input.trim()==='')return null;
  await sendMsg({text:input.trim()})
  setInput('')
 }

 const handleimgMsg=async(e)=>{
     e.preventDefault()
     const file=e.target.files[0]
     if(!file||!file.type.startsWith('image/')){
      toast.error('select a image file please')
      return;
     }
     const reader=new FileReader()
     reader.onloadend=async()=>{
      await sendMsg({image:reader.result})
      e.target.value=''
     }
     reader.readAsDataURL(file)
 }

   const scrollEnd=useRef()


    useEffect(() => {
  if (selecteduser) {
    getMessage(selecteduser._id);

    setUnseenmessages((prev) => {
      const copy = { ...prev };
      delete copy[selecteduser._id];
      return copy;
    });
  }
}, [selecteduser]);



   useEffect(()=>{
     scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages])

  return (
    
      selecteduser?(
      <div className='chat-container'>
          <div className="chat-header">
            <div className="user-detail">
              <img className='chat-user-img' src={selecteduser?.profilePic || assets.avatar_icon} />
            <p >{selecteduser.name}</p>
            {
              onlineUser.includes(selecteduser._id) ?
              <span className='green-ball'></span> :''

            }
            
            </div>
            <div className="chat-icon-block">
              <img className='arrow-icon' onClick={()=>setSelecteduser(false)} src={assets.arrow_icon} />
              <img className='help-icon' src={assets.help_icon} />
            </div>
            
           </div>
          <div className='chat-space'>
          
          {messages.map((msg,index)=>{
              return(
                <div key={index} className={`chat-box ${msg.senderId!==authUser._id? 'left-orient' :'right-orient' }`} >
                  {
                    msg.image? 
                    <img className='msg-img' src={msg.image} />
                      
                    :
                       <p className='ptag'>{msg.text}</p>
                  }
                   
                    <div className="img-and-date">
                         <img src={msg.senderId===authUser._id ? authUser?.profilePic|| assets.avatar_icon :selecteduser?.profilePic|| assets.avatar_icon } />
                       <p>{formatDate(msg.createdAt)}</p>

                    </div>
                 
                </div>
              
              )
            })}
             
            <div  ref={scrollEnd}></div>
        


           </div>
           <div className="msg-entry">
            <div className="entry-space">
              <input onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter' ? handletextInput(e) : null} value={input} className='text-space' id='text-space' type='text' placeholder='type message here' />
              <input onChange={handleimgMsg} id='image' type='file' accept='image/png,image/jpeg,image/jpg' hidden />
              <label htmlFor="image">
                <img src={assets.gallery_icon} />
              </label>
            </div>
            <img className='send-icon' onClick={handletextInput} src={assets.send_button} />

           </div>
      
               
    </div >
   
          )
      
      
      :(

        <div className="chat-initial">
          <img src={assets.logo_icon} />
          <p>Chat with Anyone,Anytime...</p>
        </div>


      )

    
    
  )
}
