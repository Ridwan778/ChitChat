import {auth, provider} from '../firebase-config.js'
import {signInWithPopup} from 'firebase/auth'

import Cookies from 'universal-cookie';

import '../styles/Auth.css';

import logo from './logo.jpg'

const cookie = new Cookies();


export const Auth = (props) => {
    const {setIsAuth} = props;

    const signInWithGoogle = async () => {
        try{
            const result = await signInWithPopup(auth, provider);
            cookie.set("auth-token", result.user.refreshToken);
            setIsAuth(true);
        }
        catch(err){
            console.error(err);
        }
    }
    return(
        <div className="auth">
            <img src={logo} style={{ width: '400px', height: '300px' }}></img>
            <h2>Welcome to ChitChat!</h2>
            <button onClick = {signInWithGoogle}> Sign In With Google</button>
        </div>
    )
}