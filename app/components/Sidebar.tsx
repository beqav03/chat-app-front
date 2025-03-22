"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";

interface Friend {
  id: number;
  name: string;
  lastname: string;
  photo: string;
  status: "pending" | "accepted" | "rejected";
}

interface ApiFriend {
  friend_id: number;
  user_name: string;
  user_lastname: string;
  user_email?: string;
  friend_status: "pending" | "accepted" | "rejected";
  profilePicture?: string;
}

interface SidebarProps {
  friends: Friend[];
  searchQuery: string;
  userId: number;
  onSelectFriend: (friendId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userId, searchQuery, onSelectFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const response = await fetchWithAuth(`/friends/${userId}`);
        if (!response || !response.ok) throw new Error("Failed to fetch friends");
        const data: ApiFriend[] = await response.json();

        const allFriends: Friend[] = data.map((friend) => ({
          id: friend.friend_id,
          name: friend.user_name,
          lastname: friend.user_lastname,
          photo: friend.profilePicture || "https://via.placeholder.com/50",
          status: friend.friend_status,
        }));

        const acceptedFriends = allFriends.filter((friend) => friend.status === "accepted");
        const pendingFriends = allFriends.filter((friend) => friend.status === "pending");

        setFriends(
          acceptedFriends.filter((friend) =>
            `${friend.name} ${friend.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setPendingRequests(
          pendingFriends.filter((friend) =>
            `${friend.name} ${friend.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriendsAndRequests();
  }, [userId, searchQuery]);

  const handleFriendClick = (friendId: number) => {
    setSelectedFriendId(friendId);
    onSelectFriend(friendId);
  };

  const handleAcceptFriendRequest = async (requestId: number) => {
    try {
      const response = await fetchWithAuth(`/friends/accept/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to accept friend request");
      const acceptedRequest = pendingRequests.find((req) => req.id === requestId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      if (acceptedRequest) {
        setFriends((prev) => [
          ...prev,
          { ...acceptedRequest, status: "accepted" },
        ]);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (requestId: number) => {
    try {
      const response = await fetchWithAuth(`/friends/reject/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to reject friend request");
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {friends.map((friend) => (
          <li
            key={friend.id}
            className={`${styles.friendItem} ${
              selectedFriendId === friend.id ? styles.selected : ''
            }`}
            onClick={() => friend.status === "accepted" && handleFriendClick(friend.id)}
          >
            <div className={styles.friendPhotoContainer}>
              <Image
                src={friend.photo}
                alt={friend.name}
                width={50}
                height={50}
                className={styles.friendPhoto}
              />
            </div>
            <span className={styles.friendName}>
              {friend.name} {friend.lastname} ({friend.status})
            </span>
          </li>
        ))}
        {pendingRequests.map((request) => (
          <li key={request.id} className={styles.friendItem}>
            <div className={styles.friendPhotoContainer}>
              <Image
                src={request.photo}
                alt={request.name}
                width={50}
                height={50}
                className={styles.friendPhoto}
              />
            </div>
            <span className={styles.friendName}>
              {request.name} {request.lastname} (Pending Request)
            </span>
            <div className={styles.friendActions}>
              <button
                className={styles.acceptButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptFriendRequest(request.id);
                }}
              >
                ✅ Accept
              </button>
              <button
                className={styles.rejectButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectFriendRequest(request.id);
                }}
              >
                ❌ Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;