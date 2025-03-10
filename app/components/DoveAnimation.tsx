import React from "react";
import styles from "../styles/doveAnimation.module.css";

const DoveAnimation: React.FC = () => {
  return (
    <div className={styles.doveContainer}>
      <div className={styles.dove}></div>
    </div>
  );
};

export default DoveAnimation;