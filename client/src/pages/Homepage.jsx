import React, { useContext } from 'react'
import { Sidebar } from '../components/Sidebar'
import { Chatcontainer } from '../components/Chatcontainer'
import { Rightsidebar } from '../components/Rightsidebar'
import './Homepage.css'
import { ChatContext } from '../../context/ChatContext'

const Homepage = () => {
  const { selecteduser, showRightSidebar, setShowRightSidebar } = useContext(ChatContext)

  return (
    <div className={`main-box ${selecteduser ? 'three-col' : 'two-col'}`}>
      {/* Sidebar hidden on mobile when chat is open */}
      <div className={selecteduser ? 'sidebar-mobile-hidden' : ''}>
        <Sidebar />
      </div>

      {/* Chat hidden on mobile until user selected */}
      <div className={!selecteduser ? 'chat-mobile-hidden' : ''}>
        <Chatcontainer />
      </div>

      {/* Right sidebar */}
      {selecteduser && (
  <>
    {/* Overlay for mobile */}
        {showRightSidebar && (
          <div
            className="sidebar-overlay"
            onClick={() => setShowRightSidebar(false)} // ✅ close on click
          ></div>
        )}

        <div className={`right-bar-desktop ${showRightSidebar ? 'right-bar-mobile-show' : ''}`}>
          <Rightsidebar />
        </div>
      </>
    )}

    </div>
  )
}

export default Homepage
