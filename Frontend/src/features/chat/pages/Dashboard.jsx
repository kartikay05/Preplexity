import React from "react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
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
