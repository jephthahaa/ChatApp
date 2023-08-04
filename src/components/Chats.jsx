import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getUsers = () => {
      if (currentUser && currentUser.uid) {
        const usersRef = collection(db, "users");
        const availableUsersQuery = showAvailableOnly
          ? query(usersRef, where("availability", "==", true))
          : usersRef;

        const unsub = onSnapshot(availableUsersQuery, (snapshot) => {
          const userArray = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              uid: doc.id,
              ...data,
            };
          });
          setUsers(userArray);
        });

        return unsub;
      }
    };

    const unsubscribe = getUsers();

    return () => {
      unsubscribe();
    };
  }, [currentUser, showAvailableOnly]);

  const handleSelect = (selectedUser) => {
    dispatch({ type: "CHANGE_USER", payload: selectedUser });
  };

  return (
    <div className="chats">
      <div className="filter-container">
        <label className="label">
          Show Available Users:
          <input
            type="checkbox"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
          />
        </label>
      </div>
      {users
        .sort((a, b) => b.lastActivity - a.lastActivity)
        .map((user) => (
          <div
            className="userChat"
            key={user.uid}
            onClick={() => handleSelect(user)}
          >
            <img src={user.photoURL} alt="" className="userChatPhoto" />
            <div className="userChatInfo">
              <span className="userChatName">{user.displayName}</span>
              <p className="userChatLastMessage">{user.lastMessage?.text}</p>
              {user.availability && <span className="availability-dot" />}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
