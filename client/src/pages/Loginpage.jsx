import React, { useContext, useState } from 'react'
import './Loginpage.css'
import assets from '../assets/assets'
import { Authcontext } from '../../context/AuthContext'
const Loginpage = () => {
  const {login}=useContext(Authcontext)
  
  const[currstate,setCurrstate]=useState('sign up')
  const [email,setEmail]=useState("")
  const [name,setName]=useState("")
  const [bio,setBio]=useState("")
  const [password,setPassword]=useState("")
  const [isdatasubmitted,setIsdatasubmitted]=useState(false)
  const submithandler=(e)=>{
      e.preventDefault()
      if(currstate==='sign up' && !isdatasubmitted){
        setIsdatasubmitted(true)
      }
      login(currstate==='sign up'?'register':'login',{name,email,bio,password})
  }
  return (
    <div className='login-page'>
      <img className='login-img' src={assets.logo_big} />
        <form onSubmit={submithandler} className='login-form'>
          <div className="login-heading">
            <h1 >{currstate}</h1>
            {
              isdatasubmitted &&(
             <img  onClick={()=>setIsdatasubmitted(false)} className='arrow-icon' src={assets.arrow_icon} />

              )
            }

          </div>
          {currstate==='sign up' && !isdatasubmitted && (
            <input className='name-input' type='text' onChange={(e)=>setName(e.target.value)} placeholder='Full Name' value={name} name='name' />
          ) }
          {!isdatasubmitted &&
          (
            <div className='login-input'>
                <input type='email' onChange={(e)=>setEmail(e.target.value)} name='email' value={email} placeholder='email'/>
               <input type='password' onChange={(e)=>setPassword(e.target.value)}  name='password' value={password} placeholder='password' />
            </div>
            
          )}
          {isdatasubmitted && currstate==='sign up' &&(
            <textarea className='text-area-bio' placeholder='hey there I am using Quichcaht' onChange={(e)=>setBio(e.target.value)} name='bio' value={bio} rows={4} />
          )}
          <button type='submit' className='login-btn'>{currstate==='sign up' ?'Create Account ':'Login ' }</button>
          {
            currstate==='sign up'? (
              <p className='login-btn-p'>Already have an Account?<a onClick={()=>setCurrstate('login')}>Login here</a></p>
            ):(
              <p className='login-btn-p'>Don't hav an Account?<a onClick={()=>setCurrstate('sign up')}>create account</a></p>
            )
          }
          <div className='login-check-block'>
            <input className='check-box' type='checkbox' required />
            <p>Accept the security terms and conditions</p>
          </div>
            

        </form> 
         
      
    

    </div>
  )
}

export default Loginpage