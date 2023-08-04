// UserStatusUpdater.js
import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const UserStatusUpdater = ({ userId }) => {
  useEffect(() => {
    const updateUserStatus = async (status) => {
      if (userId) {
        const userRef = firebase.firestore().collection('users').doc(userId);
        await userRef.update({
          online: status,
          lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    };

    updateUserStatus(true); // Set user status to online when the component mounts

    return () => {
      updateUserStatus(false); // Set user status to offline when the component unmounts
    };
  }, [userId]);

  return null; // This component doesn't render anything
};

export default UserStatusUpdater;
