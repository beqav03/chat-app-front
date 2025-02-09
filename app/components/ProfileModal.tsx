"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [user, setUser] = useState<{ name: string; email: string; bio: string }>({ name: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("https://back-end.com.ge/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handleUpdateProfile = () => {
    fetch("https://back-end.com.ge/profile/update-info", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    }).then(() => setIsEditing(false));
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.modalContent}>
        <h2>Profile</h2>
        {isEditing ? (
          <>
            <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            <input type="text" value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} />
            <button onClick={handleUpdateProfile}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;