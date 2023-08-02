import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      // Ensure currentUser exists and has a uid before fetching chats
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
          setChats(snapshot.data() || {}); // Set empty object as fallback when data is null
        });

        return () => {
          unsub();
        };
      }
    };

    getChats();
  }, [currentUser]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map(([chatId, chat]) => (
          <div
            className="userChat"
            key={chatId}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img src={chat.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat.userInfo.displayName}</span>
              <p>{chat.lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
