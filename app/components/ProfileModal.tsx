"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import { fetchWithAuth } from "../utils/api";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [user, setUser] = useState<UserProfile>({ name: "", email: "", bio: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWithAuth("/profile")
      .then((res) => res?.json())
      .then((data) => setUser(data))
      .catch(() => setError("Failed to fetch profile")); // Removed unused `err` variable
  }, []);

  const handleUpdateProfile = async () => {
    if (!user.name || !user.email) {
      setError("Name and email are required");
      return;
    }

    setIsLoading(true);
    try {
      await fetchWithAuth("/profile/update-info", {
        method: "PUT",
        body: JSON.stringify(user),
      });
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile");
      console.error("Update profile error:", error); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.profileModal}>
      <div className={styles.modalContent}>
        <h2>Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isEditing ? (
          <>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <input
              type="text"
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />
            <button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;