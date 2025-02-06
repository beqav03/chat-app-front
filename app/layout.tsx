"use client";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chat App</title>
      </head>
      <body>
        <Header />

        {/* Main layout structure */}
        <div className="layout">
          <div className="main-container">
            <div className="sidebar">
              <ChatList chats={[]} onChatSelect={() => {}} />
            </div>
            <div className="chat-window">
              <ChatWindow chat={{ name: "Chat", messages: [] }} />
            </div>
          </div>
        </div>

        {/* Render child components */}
        {children}
      </body>
    </html>
  );
}