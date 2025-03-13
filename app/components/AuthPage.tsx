"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/auth.module.css";
import MainApp from "./MainApp";
import Notification from "./Notification";
import LoadingSpinner from "./LoadingSpinner";

const AuthPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      setPasswordStrength(checkPasswordStrength(e.target.value));
    }
  };

  const checkPasswordStrength = (password: string): string => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return "Medium";
    return "Strong";
  };

  const handleAuth = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);
      const url = isRegistering
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Backend URL:", process.env.NEXT_PUBLIC_API_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }
      const responseData = await response.json();
      if (isRegistering) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsRegistering(false);
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        }, 3000);
      } else if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        setIsAuthenticated(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <MainApp onLogout={handleLogout} />;

  return (
    <div className={styles.authContainer}>
      {showSuccess && (
        <Notification
          message="Registration successful! Please log in."
          type="success"
          onClose={() => setShowSuccess(false)}
        />
      )}
      <div className={styles.authBox}>
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        {error && <p className={styles.error}>{error}</p>}
        {isRegistering && (
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        {isRegistering && (
          <>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <p className={styles.passwordStrength}>
              Password Strength: <span>{passwordStrength}</span>
            </p>
          </>
        )}
        <button onClick={handleAuth} disabled={isLoading}>
          {isRegistering ? "Register" : "Login"}
        </button>
        <p onClick={() => setIsRegistering(!isRegistering)} className={styles.toggleText}>
          {isRegistering ? "Already have an account? Log in here." : "Don't have an account? Register here."}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;