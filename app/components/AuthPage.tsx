"use client";
import React, { useState } from "react";
import styles from "../styles/auth.module.css";

const AuthPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        {isRegistering ? (
          <>
            <h2>Register</h2>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button>Register</button>
            <p onClick={() => setIsRegistering(false)}>Already have an account? Login</p>
          </>
        ) : (
          <>
            <h2>Login</h2>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Login</button>
            <p onClick={() => setIsRegistering(true)}>Don't have an account? Register</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
