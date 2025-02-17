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
      .then((res) => {
        if (!res) {
          throw new Error("Failed to fetch profile: No response");
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile");
      });
  }, []);

  const handleUpdateProfile = async () => {
    if (!user.name || !user.email) {
      setError("Name and email are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchWithAuth("/profile/update-info", {
        method: "PUT",
        body: JSON.stringify(user),
      });

      if (!response) {
        throw new Error("Failed to update profile: No response");
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
      setError("Failed to update profile");
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