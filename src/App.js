import React, { useState, useRef } from 'react';
import './App.css';
import {Auth} from "./components/Auth"
import {Chat} from "./components/Chat"

import Cookies from 'universal-cookie';

import {signOut} from "firebase/auth"

import {auth} from "./firebase-config"

import {Users} from "./components/Users"

const cookie = new Cookies();

function App() {
  const [isAuth,setIsAuth] = useState(cookie.get('auth-token'));
  const [room, setRoom] = useState('');
  const [partner, setPartner] = useState(null);
  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookie.remove("auth-token");
    setIsAuth(false);
    //setRoom(null);
    setPartner(null)

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

  const verifyPartner = () => {
    if(partner && partner.uid == auth.currentUser.uid){
      setPartner(null);
    }
  }

  return (
    <div className = "home-page">
      <div className = "user-profiles">
        <div className = "users">
          <Users setPartner = {setPartner}/>
        </div>
        <div className= "sign-out">
          <button className = "sign-out-button" onClick={signUserOut}> Sign Out</button>
        </div>
      </div>

      <div className = "chat-Page">
      <>{verifyPartner()}</>
      {partner && (
         <Chat partner = {partner}/>
      )}
      {!partner && (
        <>
        <p class = "intro-message">Welcome to ChitChat! <br/>
          Choose a partner to start a chat!</p>
        </>
      )}
      </div>

    </div>
  )
}
export default App;
