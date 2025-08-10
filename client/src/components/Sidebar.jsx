import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import './Sidebar.css'
import { Authcontext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

export const Sidebar = () => {
  const {
    selecteduser,
    setSelecteduser,
    getUser,
    users,
    unseenmessages,
    setUnseenmessages
  } = useContext(ChatContext)

  const { logout, onlineUser } = useContext(Authcontext)
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const filteredUser = input
    ? users.filter((user) =>
        user.name.toLowerCase().includes(input.toLowerCase())
      )
    : users

 useEffect(() => {
  getUser()
}, []) // ✅ Fetch only once


  return (
    <div className="side-bar">
      <div className="logo-bar">
        <img className="logo-img" src={assets.logo} />
        <div className="menu-section">
          <img className="menu-icon" src={assets.menu_icon} />
          <div className="user-profile">
            <p onClick={() => navigate('/profile')}>Profile</p>
            <hr />
            <p onClick={() => logout()}>Log out</p>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <img src={assets.search_icon} />
        <input
          onChange={(e) => setInput(e.target.value)}
          id="search"
          className="search"
          type="text"
          placeholder="Search user..."
        />
      </div>

      <div className="user-contacts">
        {filteredUser.map((user) => {
          const unseenCount = unseenmessages[user._id] || 0

          return (
            <div
              key={user._id}
              className={`user-contact ${
                selecteduser?._id === user._id ? 'selecteduser' : ''
              }`}
              onClick={() => {
                setSelecteduser(user)
                setUnseenmessages((prev) => ({
                  ...prev,
                  [user._id]: 0
                }))
              }}
            >
              <img
                className="user-contact-img"
                src={user.profilePic ? user.profilePic : assets.avatar_icon}
              />
              <div className="user-info">
                <p>{user.name}</p>
                {onlineUser.includes(user._id) ? (
                  <span className="online">online</span>
                ) : (
                  <span className="offline">offline</span>
                )}
              </div>

              {/* 🔴 Unseen Badge */}
              {unseenCount > 0 && (
                <div className="unseen-badge">{unseenCount}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
