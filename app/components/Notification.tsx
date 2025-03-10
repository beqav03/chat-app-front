import React, { useEffect, useState } from "react";
import styles from "../styles/notification.module.css";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    visible && (
      <div className={`${styles.notification} ${styles[type]} ${styles.visible}`}>
        {message}
      </div>
    )
  );
};

export default Notification;