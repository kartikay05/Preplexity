import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchMessages } from '../service/chat.api';
import { setMessages } from '../chat.slice';

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
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    if (!currentChat && messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                    What do you want to know?
                </h2>
                <p className="text-zinc-500 max-w-md leading-relaxed text-lg">
                    Ask any question, or start a new conversation. Krt AI is here to help you explore and create.
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
                        className={`flex gap-4 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* Avatar */}
                        <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-lg
                            ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600/20 text-indigo-500'}
                        `}>
                            {msg.role === 'user' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                        </div>

                        {/* Content Container */}
                        <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 opacity-60">
                                {msg.role === 'user' ? 'You' : 'Krt AI'}
                            </h4>
                            <div className={`
                                prose-zinc max-w-none
                                ${msg.role === 'user' 
                                    ? 'bg-zinc-900 border border-white/5 p-4 rounded-2xl rounded-tr-none text-zinc-200 inline-block text-left' 
                                    : 'text-zinc-300 leading-relaxed text-[17px]'}
                            `}>
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-4" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-4" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-2" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-zinc-400" {...props} />,
                                        code: ({node, inline, ...props}) => 
                                            inline 
                                            ? <code className="bg-zinc-800/80 px-1 py-0.5 rounded text-indigo-300 text-sm font-mono" {...props} />
                                            : <code className="block bg-zinc-900/80 p-4 rounded-xl border border-white/5 my-4 overflow-x-auto text-sm text-indigo-300 font-mono shadow-inner" {...props} />
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex items-start gap-4 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center shrink-0 mt-1">
                            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                        <div className="flex-1 space-y-3 pt-2">
                            <div className="h-4 bg-zinc-800/50 rounded-full w-3/4" />
                            <div className="h-4 bg-zinc-800/50 rounded-full w-1/2" />
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} className="h-4" />
            </div>
        </div>
    );
};

export default MessageList;
