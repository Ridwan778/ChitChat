import React, { useState, useRef } from 'react';
import './App.css';
import {Auth} from "./components/Auth"
import {Chat} from "./components/Chat"

import Cookies from 'universal-cookie';

const cookie = new Cookies();

function App() {
  const [isAuth,setIsAuth] = useState(cookie.get('auth-token'));
  const [room, setRoom] = useState('');
  const roomInputRef = useRef(null);

  if(!isAuth){
    return (
      <div>
        <Auth setIsAuth = {setIsAuth}/>
      </div>
    );
  }

  return (
    <div>
      {room ? (
      <div>
        <Chat/>
      </div>) : (
      <div className = "room">
        <label>Enter Room Name:</label>
        <input ref = {roomInputRef}/>
        <button onClick = {() => setRoom(roomInputRef.current.value)}> Enter Chat </button>
      </div>
      )}
    </div>
  )

}

export default App;
