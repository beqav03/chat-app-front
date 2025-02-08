"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    photo: "/default-profile.png",
    firstName: "John",
    lastName: "Doe",
    bio: "Hello, I love coding!",
    email: "john.doe@example.com",
  });

  useEffect(() => {
    // Disable scrolling when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when modal closes
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({ ...profile, photo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className={`${styles.overlay} ${styles.show}`}>
      <div className={`${styles.modal} ${styles.show}`}>
        <h2>Profile</h2>
        <div className={styles.profileSection}>
          <label className={styles.photoLabel}>
            <input type="file" onChange={handleFileChange} hidden />
            <img src={profile.photo} alt="Profile" className={styles.profilePhoto} />
          </label>
        </div>

        <div className={styles.info}>
          {isEditing ? (
            <>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
              <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
              <textarea name="bio" value={profile.bio} onChange={handleChange} />
              <button onClick={() => setIsEditing(false)}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}
          <button className={styles.changeButton}>Change Email</button>
          <button className={styles.changeButton}>Change Password</button>
        </div>

        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;