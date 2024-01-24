import { addDoc, collection, serverTimestamp, onSnapshot,
        query, where, orderBy } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
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

export const Chat = () => {

    const [newMessage, setNewMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");

    ///const [photoURL, setPhotoURL] = useState(null);

    useEffect(() => {
        const queryMessages = query(messagesRef, orderBy("createdAt"));

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
            profileURL : auth.currentUser.photoURL
        });

        setNewMessage('');
        //console.log(newMessage);
    };
    const messagesContainerRef = useRef(null);

    useEffect(() => {
    // Scroll to the bottom whenever messages change
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }, [messages]);

    return (
      <div className="chat-app">
        <div className="header">
          <h1>Welcome to ChitChat, {auth.currentUser?.displayName || 'Guest'}!</h1>
        </div>
        <div className="messages">
          <div ref={messagesContainerRef} className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.profileURL ? 'with-profile' : ''}`}>
                {message.profileURL && <img src={message.profileURL} alt="Profile" />}
                <div className="message-content">
                  <span className="user">{message.user}:</span>
                  <span className="text">{message.text}</span>
                </div>
                <span className="timestamp">{formatTimestamp(message.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="new-message-form">
          <input
            className="new-message-input"
            placeholder="Type your message here"
            onChange={(event) => setNewMessage(event.target.value)}
            value={newMessage}
          />
          <button className="send-button" type="submit">
            Send
          </button>
        </form>
      </div>
    );
}