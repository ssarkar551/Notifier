import { useState } from 'react'
import Notifications from './Notifications.jsx';
import Home from './Home.jsx';
import Events from './Events.jsx';
import './App.css'
import { NavLink, Route, Routes } from 'react-router'

function App() {
  

  return (
    <>
    <div className="navbar">
      <nav>
        <ul>
          <NavLink to='/'><li>Home</li></NavLink>
          <NavLink to='/Notifications'><li>Notifications</li></NavLink>
          <NavLink to='/Events'><li>Events</li></NavLink>
        </ul>
      </nav>
    </div>
    <Routes>
      <Route path='/' element = {<Home/>} />
      <Route path='/notifications' element = {<Notifications/>} />
      <Route path='/events' element = {<Events/>} />
    </Routes>
    
    </>
  )
}

export default App
