"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/profile.module.css";
import { fetchWithAuth } from "../utils/api";
import Image from "next/image";
import Notification from "./Notification";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  lastname?: string;
  profilePicture?: string;
  bio?: string;
}

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", lastname: "", bio: "", profilePicture: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [emailData, setEmailData] = useState({ newEmail: "", code: "" });
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetchWithAuth("/profile");
        if (!response || !response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name,
          lastname: data.lastname || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);
      try {
        const response = await fetchWithAuth("/profile/update-picture", {
          method: "PUT",
          body: formData,
        });
        if (!response || !response.ok) throw new Error("Failed to update picture");
        const data = await response.json();
        setFormData((prev) => ({ ...prev, profilePicture: data.profilePicture }));
        setUser((prev) => (prev ? { ...prev, profilePicture: data.profilePicture } : null));
        setShowSuccess("Profile picture updated successfully!");
      } catch {
        setError("Failed to update picture");
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetchWithAuth("/profile/update-info", {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!response || !response.ok) throw new Error("Failed to update profile");
      setUser((prev) => (prev ? { ...prev, ...formData } : null));
      setIsEditing(false);
      setShowSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to save profile");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetchWithAuth("/profile/update-password", {
        method: "PUT",
        body: JSON.stringify(passwordData),
      });
      if (!response || !response.ok) throw new Error("Failed to change password");
      setShowChangePassword(false);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setShowSuccess("Password changed successfully!");
    } catch {
      setError("Failed to change password");
    }
  };

  const handleChangeEmail = async () => {
    try {
      const response = await fetchWithAuth("/profile/update-email", {
        method: "PUT",
        body: JSON.stringify({ newEmail: emailData.newEmail }),
      });
      if (!response || !response.ok) throw new Error("Failed to initiate email change");
      setEmailVerificationSent(true);
    } catch {
      setError("Failed to initiate email change");
    }
  };

  const handleConfirmEmail = async () => {
    try {
      const response = await fetchWithAuth("/profile/confirm-email", {
        method: "PUT",
        body: JSON.stringify({ code: emailData.code }),
      });
      if (!response || !response.ok) throw new Error("Invalid verification code");
      setUser((prev) => (prev ? { ...prev, email: emailData.newEmail } : null));
      setShowChangeEmail(false);
      setEmailVerificationSent(false);
      setEmailData({ newEmail: "", code: "" });
      setShowSuccess("Email updated successfully!");
    } catch {
      setError("Invalid verification code");
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.modalOverlay}>
      {showSuccess && (
        <Notification
          message={showSuccess}
          type="success"
          onClose={() => setShowSuccess("")}
        />
      )}
      <div className={styles.modalContent}>
        <h2>Profile Information</h2>
        {formData.profilePicture && (
          <div onClick={() => document.getElementById("profilePicInput")?.click()}>
            <Image
              src={formData.profilePicture}
              alt="Profile"
              width={150}
              height={150}
              className={styles.profilePicture}
            />
            <input
              type="file"
              id="profilePicInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        )}
        {isEditing ? (
          <>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name"
            />
            <input
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              placeholder="Lastname"
            />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Bio"
            />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Lastname:</strong> {formData.lastname}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Bio:</strong> {formData.bio || "No bio yet"}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
        <button onClick={() => setShowChangePassword(true)}>Change Password</button>
        <button onClick={() => setShowChangeEmail(true)}>Change Email</button>
        {showChangePassword && (
          <div>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              placeholder="Old Password"
            />
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="New Password"
            />
            <button onClick={handleChangePassword}>Submit</button>
          </div>
        )}
        {showChangeEmail && (
          <div>
            <input
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
              placeholder="New Email"
            />
            {emailVerificationSent && (
              <input
                type="text"
                value={emailData.code}
                onChange={(e) => setEmailData({ ...emailData, code: e.target.value })}
                placeholder="Verification Code"
              />
            )}
            <button onClick={emailVerificationSent ? handleConfirmEmail : handleChangeEmail}>
              {emailVerificationSent ? "Confirm" : "Submit"}
            </button>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;