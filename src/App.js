import React, { useState, useRef } from 'react';
import './App.css';
import {Auth} from "./components/Auth"
import {Chat} from "./components/Chat"

import Cookies from 'universal-cookie';

import {signOut} from "firebase/auth"

import {auth} from "./firebase-config"

const cookie = new Cookies();

function App() {
  const [isAuth,setIsAuth] = useState(cookie.get('auth-token'));
  const [room, setRoom] = useState('');
  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookie.remove("auth-token");
    setIsAuth(false);
    setRoom(null);

  }

  if(!isAuth){
    return (
      <div className = "login-Page">
        <div className = "Login-Menu">
          <Auth setIsAuth = {setIsAuth}/>
        </div>
      </div>
    );
  }

  return (
    <div className = "chat-Page">
      <Chat/>
      <div className= "sign-out">
        <button className = "sign-out-button" onClick={signUserOut}> Sign Out</button>
      </div>
    </div>
  )

}

export default App;
