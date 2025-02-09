"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePicture: string;
}

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", bio: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://back-end.com.ge/profile", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to load profile");
      const data = await response.json();
      setProfile(data);
      setFormData({ firstName: data.firstName, lastName: data.lastName, bio: data.bio || "" });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("http://back-end.com.ge/profile/update-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    try {
      const response = await fetch("http://back-end.com.ge/profile/update-picture", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload profile picture");
      fetchProfile();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <h2>Profile</h2>
        <img src={profile.profilePicture} alt="Profile" className={styles.profilePicture} />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUploadPicture}>Upload</button>
        {editing ? (
          <>
            <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            <button onClick={handleUpdateProfile}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio || "No bio available"}</p>
            <button onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;