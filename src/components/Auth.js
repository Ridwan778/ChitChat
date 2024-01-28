import { addDoc, collection, serverTimestamp, onSnapshot,
    query, where, orderBy, getDocs } from "firebase/firestore";
import {auth, provider, db} from '../firebase-config.js'
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
            addNewUser();
        }
        catch(err){
            console.error(err);
        }
    }

    const usersRef = collection(db, "users");

    const addNewUser = async () => {
        const sameUser = query(usersRef, where("uid", "==", auth.currentUser.uid));
        const docs = await getDocs(sameUser);
        if (docs.size > 0) {
            return;
        }
        else{
            await addDoc(usersRef,  {
                uid: auth.currentUser.uid,
                createdAt: serverTimestamp(),
                userName: auth.currentUser.displayName,
                profileURL : auth.currentUser.photoURL,
            })
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