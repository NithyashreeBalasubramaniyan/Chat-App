import { Navigate, Route, Routes } from "react-router-dom"
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Profile  from './pages/Profile'
import {Toaster} from 'react-hot-toast'
import {Authcontext} from '../context/AuthContext'
import { useContext } from "react"

function App() {
  const {authUser}=useContext(Authcontext)

  

  return (
    <div className="app-container">
      <Toaster  position="top-right" reverseOrder={false}/>
      <Routes>
        <Route path="/" element={authUser?<Homepage />:<Navigate to='/login'/>} />
        <Route path="/login" element={!authUser?<Loginpage />:<Navigate to='/'/>} />
        <Route path="/profile" element={authUser?<Profile/>:<Navigate to='/login'/> } />
      </Routes>
    </div>
  )
}

export default App
