import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [err, setErr] = useState(false);
  const [user, setUser] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    setErr(false);
    setActiveUsers([]);

    if (username.trim() === "") {
      return;
    }

    try {
      // Search for active users based on the query
      const q = query(
        collection(db, "status"),
        where("displayName", "==", username),
        where("online", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => doc.data());

      setActiveUsers(users);
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async (selectedUser) => {
    // Check if the user is active before proceeding
    if (!selectedUser.online) {
      setErr(true);
      return;
    }

    // Your existing logic to create a chat with the selected user
    // ...

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find an active user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {err && <span>User not found or not active!</span>}
      {activeUsers.map((user) => (
        <div className="userChat" key={user.uid} onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
