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

const isCurrentUser = (message) => {
  return message.from === auth.currentUser.displayName;
}

export const Chat = (props) => {
    const {partner} = props;

    const [newMessage, setNewMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const messagesRef = collection(db, "messages");

    ///const [photoURL, setPhotoURL] = useState(null);

    useEffect(() => {
        const queryMessages = query(messagesRef,
        where("from", "in", [auth.currentUser.displayName, partner.userName]),
        where("to", "in", [auth.currentUser.displayName, partner.userName]),
        orderBy("createdAt") 
        );

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
    }, [partner])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(newMessage === "") return;
        await addDoc(messagesRef,  {
            text: newMessage,
            createdAt: serverTimestamp(),
            from: auth.currentUser.displayName,
            profileURL : auth.currentUser.photoURL,
            to: partner.userName,
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
          <div>
          {partner && (
         <>
            <img src={partner.profileURL} alt="Profile" />
            <p>{partner.userName}</p>
         </>
      )}
          </div>
        </div>
        
          <div ref={messagesContainerRef} className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${isCurrentUser(message) ? 'current-user' : 'other-user'}`}>
                {message.profileURL && <img src={message.profileURL} alt="Profile" />}
                <div className="message-content">
                  <span className="text">{message.text}</span>
                </div>
                {/* <span className="timestamp">{formatTimestamp(message.createdAt)}</span> */}
              </div>
            ))}
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