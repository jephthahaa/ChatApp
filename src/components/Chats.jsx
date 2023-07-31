import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, database, ref, onValue, set, onDisconnect } from "../firebase";
 


const Chats = () => {
  const [chats, setChats] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      // Ensure currentUser exists and has a uid before fetching chats
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (snapshot) => {
          setChats(snapshot.data()?.chats || {}); // Set empty object as fallback when data is null
        });

        return () => {
          unsub();
        };
      }
    };

    const fetchAvailableUsers = () => {
      const usersRef = ref(database, "/status");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const availableUserIds = Object.keys(data).filter((userId) => data[userId].online);
          setAvailableUsers(availableUserIds);
        } else {
          setAvailableUsers([]);
        }
      });
    };

    getChats();
    fetchAvailableUsers();
  }, [currentUser]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleDeleteMessage = async (chatId, messageId) => {
    try {
      await deleteDoc(doc(db, "userChats", currentUser.uid, "chats", chatId, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteDoc(doc(db, "userChats", currentUser.uid, "chats", chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map(([chatId, chat]) => {
          const isAvailable = availableUsers.includes(chat.userInfo.uid);

          return (
            <div
              className={`userChat${isAvailable ? " available" : ""}`}
              key={chatId}
              onClick={() => handleSelect(chat.userInfo)}
            >
              <img src={chat.userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat.userInfo.displayName}</span>
                <p>{chat.lastMessage?.text}</p>
                <button onClick={() => handleDeleteChat(chatId)}>Delete Chat</button>
              </div>
              <div className="messageList">
                {chat.messages?.map((message) => (
                  <div className="message" key={message.messageId}>
                    <p>{message.text}</p>
                    <button onClick={() => handleDeleteMessage(chatId, message.messageId)}>
                      Delete Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
