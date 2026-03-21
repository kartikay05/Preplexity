import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchMessages } from "../service/chat.api";
import { setMessages } from "../chat.slice";

const MessageList = () => {
  const messages = useSelector((state) => state.chat.messages);
  const currentChat = useSelector((state) => state.chat.currentChat);
  const loading = useSelector((state) => state.chat.loading);
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (currentChat?._id) {
      const loadMessages = async () => {
        try {
          const data = await fetchMessages(currentChat._id);
          dispatch(setMessages(data.messages));
        } catch (err) {
          console.error(err);
        }
      };
      loadMessages();
    } else {
      dispatch(setMessages([]));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!currentChat && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          style={{ background: "var(--gradient-btn)" }}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h2
          className="text-4xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          What do you want to know?
        </h2>

        <p
          className="max-w-md leading-relaxed text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Ask any question, or start a new conversation. Krt AI is here to help
          you explore and create.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-10">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex gap-4 animate-fade-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-md"
              style={
                msg.role === "user"
                  ? { background: "var(--input-bg)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }
                  : { background: "var(--accent-light)", color: "var(--accent)" }
              }
            >
              {msg.role === "user" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <h4
                className="text-[10px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)", opacity: 0.8 }}
              >
                {msg.role === "user" ? "You" : "Krt AI"}
              </h4>

              <div
                className="transition-colors duration-300"
                style={
                  msg.role === "user"
                    ? {
                        display: "inline-block",
                        textAlign: "left",
                        background: "var(--input-bg)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        padding: "1rem",
                        borderRadius: "1rem 1rem 0.25rem 1rem",
                      }
                    : {
                        color: "var(--text-primary)",
                        fontSize: "17px",
                        lineHeight: "1.75",
                      }
                }
              >
                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => (
                        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }} {...props} />
                      ),
                      h2: (props) => (
                        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }} {...props} />
                      ),
                      h3: (props) => (
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }} {...props} />
                      ),
                      p: (props) => (
                        <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }} {...props} />
                      ),
                      ul: (props) => (
                        <ul className="list-disc ml-6 mb-4" style={{ color: "var(--text-secondary)" }} {...props} />
                      ),
                      ol: (props) => (
                        <ol className="list-decimal ml-6 mb-4" style={{ color: "var(--text-secondary)" }} {...props} />
                      ),
                      li: (props) => <li className="mb-1" {...props} />,
                      strong: (props) => (
                        <strong className="font-bold" style={{ color: "var(--text-primary)" }} {...props} />
                      ),
                      em: (props) => (
                        <em className="italic" style={{ color: "var(--text-secondary)" }} {...props} />
                      ),
                      a: (props) => (
                        <a
                          className="underline transition-colors"
                          style={{ color: "var(--accent)" }}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      pre: (props) => (
                        <pre
                          className="p-4 rounded-xl overflow-x-auto my-4"
                          style={{
                            background: "var(--input-bg)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {props.children}
                        </pre>
                      ),
                      code({ inline, className, children, ...props }) {
                        return inline ? (
                          <code
                            className="px-1 py-0.5 rounded text-sm font-mono"
                            style={{
                              background: "var(--input-bg)",
                              border: "1px solid var(--border-color)",
                              color: "var(--accent)",
                            }}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className="text-sm font-mono"
                            style={{ color: "var(--accent)" }}
                          >
                            {children}
                          </code>
                        );
                      },
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          className="rounded-xl my-4 max-w-full h-auto"
                          style={{ border: "1px solid var(--border-color)" }}
                        />
                      ),
                      blockquote: (props) => (
                        <blockquote
                          className="pl-4 italic my-4"
                          style={{
                            borderLeft: "4px solid var(--accent)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {props.children}
                        </blockquote>
                      ),
                      table: (props) => (
                        <div className="overflow-x-auto my-4">
                          <table
                            className="table-auto border-collapse w-full text-sm text-left"
                            style={{ color: "var(--text-secondary)" }}
                            {...props}
                          />
                        </div>
                      ),
                      th: (props) => (
                        <th
                          className="px-3 py-2 font-semibold"
                          style={{
                            border: "1px solid var(--border-color)",
                            background: "var(--input-bg)",
                            color: "var(--text-primary)",
                          }}
                          {...props}
                        />
                      ),
                      td: (props) => (
                        <td
                          className="px-3 py-2"
                          style={{ border: "1px solid var(--border-color)" }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex items-start gap-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1"
              style={{ background: "var(--accent-light)" }}
            >
              <div
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--border-color)", borderTopColor: "var(--accent)" }}
              />
            </div>
            <div className="flex-1 space-y-3 pt-2 animate-pulse">
              <div className="h-4 rounded-full w-3/4" style={{ background: "var(--input-bg)" }} />
              <div className="h-4 rounded-full w-1/2" style={{ background: "var(--input-bg)" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};

export default MessageList;
