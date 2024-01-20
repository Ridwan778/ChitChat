import { addDoc, collection, serverTimestamp, onSnapshot,
        query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";
import '../styles/Chat.css';

const formatTimestamp = (timestamp) => {

    if (!timestamp || !timestamp.toDate) {
        return "Unknown Date";
    }
    
    const options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    };
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    return dateFormatter.format(timestamp.toDate());
  };

export const Chat = (props) => {
    const {room} = props;

    const [newMessage, setNewMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));

        //we cleanUp after using listening subscribe in useEffect hooks to prevent leaks
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            });
            setMessages(messages);
            //console.log("NEW MESSAGE");
        });

        return () => unsubscribe();
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(newMessage === "") return;
        await addDoc(messagesRef,  {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: room,
        });

        setNewMessage('');
        //console.log(newMessage);
    };

    return (
    <div className="chat-app">
        <div className="header">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
        <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="user">{message.user}:</span> {message.text}&nbsp; &nbsp;{formatTimestamp(message.createdAt)}
          </div>
        ))}
      </div>
        <form onSubmit = {handleSubmit} className = "new-message-form">
            <input className="new-message-input" 
            placeholder="Type your message here" 
            onChange={(event) => setNewMessage(event.target.value)}
            value = {newMessage}/>
            <button className="send-button" type="submit"> Send </button>
        </form>
    </div>
    );
}