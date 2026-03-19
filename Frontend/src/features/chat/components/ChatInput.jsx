import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage as apiSendMessage,
  fetchMessages,
} from "../service/chat.api";

import {
  addMessage,
  setCurrentChat,
  setLoading,
  setError,
  setMessages,
  addChat,
} from "../chat.slice";

import { useCustomToast } from "../../../app/ToastProvider";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const currentChat = useSelector((state) => state.chat.currentChat);
  const loading = useSelector((state) => state.chat.loading);
  const showToast = useCustomToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const messageText = input;
    setInput("");

    try {
      dispatch(setLoading(true));

      const res = await apiSendMessage({
        message: messageText,
        chat: currentChat?._id,
      });

      // If it was a new chat, update current chat and fetch history
      if (!currentChat) {
        dispatch(addChat(res.chat));
        dispatch(setCurrentChat(res.chat));
        // We'll fetch all messages for the new chat to ensure sync
        const msgData = await fetchMessages(res.chat._id);
        dispatch(setMessages(msgData.messages));
      } else {
        // If existing chat, just add the user message and AI response
        // Actually, backend returns full aiMessage object
        const userMsg = { content: messageText, role: "user", _id: Date.now() };
        dispatch(addMessage(userMsg));
        dispatch(addMessage(res.aiMessage));
      }
    } catch (err) {
      showToast("Failed to send message", "error");
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-white/20"
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          <textarea
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask anything..."
            className="w-full bg-transparent border-none outline-none resize-none text-white px-4 py-3 placeholder-zinc-500 text-lg leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`
                            px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all
                            ${
                              input.trim() && !loading
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            }
                        `}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
            <span>Send</span>
          </button>
        </div>
      </form>
      <p className="text-center text-[10px] text-zinc-600 mt-4 leading-relaxed">
        Krt AI can make mistakes. Please check important info.
      </p>
    </div>
  );
};

export default ChatInput;
