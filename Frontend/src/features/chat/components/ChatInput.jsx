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

      if (!currentChat) {
        dispatch(addChat(res.chat));
        dispatch(setCurrentChat(res.chat));
        const msgData = await fetchMessages(res.chat._id);
        dispatch(setMessages(msgData.messages));
      } else {
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

  const canSend = input.trim() && !loading;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="relative rounded-xl p-1 transition-all duration-200"
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--input-border)",
          boxShadow: "var(--shadow-card)",
        }}
        onFocus={() => {}}
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
            className="w-full bg-transparent border-none outline-none resize-none px-3 py-2 text-sm leading-relaxed transition-colors"
            style={{
              color: "var(--text-primary)",
            }}
          />

          <button
            type="submit"
            disabled={!canSend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-200 shrink-0"
            style={
              canSend
                ? {
                    background: "var(--gradient-btn)",
                    color: "#fff",
                    boxShadow: "0 4px 15px rgba(99,102,241,0.35)",
                  }
                : {
                    background: "var(--input-bg)",
                    color: "var(--text-muted)",
                    cursor: "not-allowed",
                  }
            }
            onMouseEnter={e => { if (canSend) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? (
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--text-muted)", borderTopColor: "var(--accent)" }}
              />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
            <span>Send</span>
          </button>
        </div>
      </form>

      <p
        className="text-center text-[10px] mt-3 leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        Krt AI can make mistakes. Please verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
