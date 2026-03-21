import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >

      {/* Mobile Hamburger Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-40 p-2 rounded-lg transition-colors shadow-sm"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Chat Area */}
      <main
        className="flex-1 flex flex-col relative min-w-0 transition-colors duration-300"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Background Decorative Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
            style={{ background: "rgba(99,102,241,0.06)" }} />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
            style={{ background: "rgba(124,58,237,0.06)" }} />
        </div>

        {/* Message Content */}
        <MessageList />

        {/* Input Area */}
        <div className="pb-8 pt-2">
          <ChatInput />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
