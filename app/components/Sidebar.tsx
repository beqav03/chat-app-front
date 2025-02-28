"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Image from "next/image";
import { fetchWithAuth } from "../utils/api";
import DoveAnimation from "./DoveAnimation";

interface Friend {
  id: number;
  name: string;
  lastname: string;
  photo: string;
  status: "pending" | "accepted" | "rejected";
}

interface PendingRequest {
  id: number;
  senderId: number;
  senderName: string;
  senderLastname: string;
  status: "pending";
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
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [showDove, setShowDove] = useState(false);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        const response = await fetchWithAuth(`/friends/${userId}`);
        if (!response || !response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        const mappedFriends: Friend[] = (data.friends || []).map((friend: ApiFriend) => ({
          id: friend.friend_id,
          name: friend.user_name,
          lastname: friend.user_lastname,
          photo: friend.profilePicture || "https://via.placeholder.com/50",
          status: friend.friend_status,
        }));

        const mappedRequests: PendingRequest[] = (data.pendingRequests || []).map((req: PendingRequest) => ({
          id: req.id,
          senderId: req.senderId,
          senderName: req.senderName,
          senderLastname: req.senderLastname,
          status: req.status,
        }));

        setFriends(
          mappedFriends.filter((friend) =>
            `${friend.name} ${friend.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
        setPendingRequests(
          mappedRequests.filter((req) =>
            `${req.senderName} ${req.senderLastname}`.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriendsAndRequests();
  }, [userId, searchQuery]);

  const handleFriendClick = async (friendId: number) => {
    try {
      const response = await fetchWithAuth(`/chat/history/${friendId}`);
      if (!response || !response.ok) throw new Error("Failed to fetch chat history");
      onSelectFriend(friendId);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleAcceptFriendRequest = async (requestId: number) => {
    setShowDove(true);
    try {
      const response = await fetchWithAuth(`/friends/accept/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to accept friend request");
      const acceptedRequest = pendingRequests.find((req) => req.id === requestId);
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      if (acceptedRequest) {
        setFriends((prev) => [
          ...prev,
          {
            id: requestId,
            name: acceptedRequest.senderName,
            lastname: acceptedRequest.senderLastname,
            photo: "https://via.placeholder.com/50",
            status: "accepted",
          },
        ]);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setTimeout(() => setShowDove(false), 2000);
    }
  };

  const handleRejectFriendRequest = async (requestId: number) => {
    setShowDove(true);
    try {
      const response = await fetchWithAuth(`/friends/reject/${requestId}`, { method: "POST" });
      if (!response || !response.ok) throw new Error("Failed to reject friend request");
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setTimeout(() => setShowDove(false), 2000);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {showDove && <DoveAnimation />}
      <h2>Friends</h2>
      <ul className={styles.friendList}>
        {friends.map((friend) => (
          <li
            key={friend.id}
            className={styles.friendItem}
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
                src="https://via.placeholder.com/50"
                alt={request.senderName}
                width={50}
                height={50}
                className={styles.friendPhoto}
              />
            </div>
            <span className={styles.friendName}>
              {request.senderName} {request.senderLastname} (Pending Request)
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