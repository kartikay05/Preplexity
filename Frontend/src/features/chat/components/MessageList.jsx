import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">What do you want to know?</h2>
                <p className="text-zinc-500 max-w-md leading-relaxed">
                    Ask any question, or start a new conversation. Krt AI is here to help you explore and create.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-12">
                {messages.map((msg, index) => (
                    <div key={msg._id || index} className="animate-fade-in">
                        <div className="flex items-start gap-4">
                            {/* Role Icon */}
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1
                                ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-400' : 'bg-indigo-600/20 text-indigo-500'}
                            `}>
                                {msg.role === 'user' ? 'U' : 'AI'}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                                    {msg.role === 'user' ? 'You' : 'Krt AI'}
                                </h4>
                                <div className={`
                                    text-lg leading-relaxed
                                    ${msg.role === 'user' ? 'text-zinc-200 font-medium' : 'text-zinc-300'}
                                `}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex items-start gap-4 animate-pulse">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center shrink-0 mt-1">
                            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                        <div className="flex-1 pt-4">
                            <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
                            <div className="h-4 bg-zinc-800 rounded w-1/2" />
                        </div>
                    </div>
                )}
                
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default MessageList;
