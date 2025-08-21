import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Profile from './pages/Profile/Profile'
import Admin from './pages/Admin/Admin'
import Publications from './pages/Publications/Publications'
import AboutUs from './components/AboutUs/AboutUs'
import Dashboard from './pages/Dashboard/Dashboard'
import Conference from './pages/Conference/Conference'
import AboutUs2 from './pages/AboutUs2/AboutUs2'
const App = () => {
  return (
    <div className="app">
      <Navbar/>
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/profile' element={<Profile/>}/>
         <Route path='/admin' element={<Admin/>}/>
         <Route path='/publications' element={<Publications/>}/>
         <Route path='/aboutus' element={<AboutUs/>}/>
         <Route path='/dashboard' element={<Dashboard/>}/>
         <Route path='/conference' element={<Conference/>}/>
         <Route path='/aboutus2' element={<AboutUs2/>}/>
      </Routes> 
      <Footer/>
    </div>
      
  )
}

export default App
