import { collection, onSnapshot,
    query, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase-config";

import '../styles/Users.css';

export const Users = (props) => {
    const {setPartner} = props;
    const usersRef = collection(db, "users");
    const [users, setUsers] = useState([]);

    const showUser = async () => {
        const docs = await getDocs(usersRef);
        let usersData = [];
        try {
            if (auth.currentUser) {
                docs.forEach((doc) => {
                    const userData = doc.data();
                    usersData.push(userData);
                });
                // to filter out current user
                //usersData = usersData.filter(user => user.uid !== auth.currentUser.uid);
                setUsers(usersData);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        showUser();
    }, [users]); 

    return(
        <div className="UsersList">
            <h3> Current Members </h3>
            {users.map(user => (
                <div key = {user.uid} className="individualUser" onClick = {() => setPartner(user) }>
                    <img src={user.profileURL} alt="Profile" />
                    <p>{user.userName}</p>
                </div>
            ))}
        </div>
    );
};
