"use client";
import { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage";
import MainApp from "./components/MainApp";
import LoadingSpinner from "./components/LoadingSpinner"; // Assume we have a loading spinner component

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <MainApp onLogout={() => setIsAuthenticated(false)} />;
  }

  return <AuthPage />;
}