import React, { useState } from 'react'
import { useContext } from 'react'

import {Sidebar} from '../components/Sidebar'
import {Chatcontainer} from '../components/Chatcontainer'
import {Rightsidebar} from '../components/Rightsidebar'
import './Homepage.css'
import { ChatContext } from '../../context/ChatContext'
 const Homepage = () => {
const { selecteduser } = useContext(ChatContext)

  return (
    <div className={`main-box ${selecteduser?'three-col':'two-col'}`}>

      <Sidebar/>
      <Chatcontainer />
      {selecteduser &&
      <Rightsidebar   />
      }
      
    </div>
  )
}

export default Homepage
