import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import './Profile.css'
import { Authcontext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()
  const { updateProfile, authUser } = useContext(Authcontext)

  const [img, setImg] = useState(authUser.profilePic)
  const [bio, setBio] = useState(authUser.bio)
  const [fullname, setFullname] = useState(authUser.name)

  const submithandler = async (e) => {
    e.preventDefault()

    if (!img || typeof img === 'string') {
      await updateProfile({ name: fullname, bio })
      navigate('/')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onload = async () => {
      const base64Image = reader.result
      await updateProfile({ profilePic: base64Image, name: fullname, bio })
      navigate('/')
    }
  }

  return (
    <div>
      <div className="profile-contents">
        <form onSubmit={submithandler} className="profile-content">
          <h2>Profile details</h2>
          <div>
            <label className="img-input-label" htmlFor='profile-img-input'>
              <div className='profile-pic-container'>
               <img
                    className='profile-pic-changed'
                    src={
                      img
                        ? typeof img === 'string'
                          ? img
                          : URL.createObjectURL(img)
                        : assets.avatar_icon
                    }
                  />

              </div>
              <input
                onChange={(e) => setImg(e.target.files[0])}
                id='profile-img-input'
                type='file'
                accept='.jpg, .png'
                hidden
              />
              upload profile image
            </label>
          </div>
          <input
            type='text'
            className='profile-name'
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            placeholder='Full Name'
          />
          <textarea
            className='profile-bio'
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={6}
            placeholder='Hey there I am using Quickchat'
          />
          <button type='submit' className='profile-update-btn'>Save</button>
        </form>
        <div className="profile-logo-container">
          <img src={assets.logo_icon} />
        </div>
      </div>
    </div>
  )
}

export default Profile
