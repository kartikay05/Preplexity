import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChats, deleteChat as apiDeleteChat } from '../service/chat.api';
import { setChats, setCurrentChat, setError } from '../chat.slice';
import { logout as logoutApi } from '../../auth/service/auth.api';
import { logout as logoutAuth } from '../../auth/auth.slice';
import { useCustomToast } from '../../../app/ToastProvider';
import ThemeToggle from '../../../app/ThemeToggle';

const Sidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chats = useSelector((state) => state.chat.chats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const user = useSelector((state) => state.auth.user);
    const showToast = useCustomToast();
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLogout(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await fetchChats();
                dispatch(setChats(data.chat));
            } catch (err) {
                console.error(err);
            }
        };
        loadChats();
    }, [dispatch]);

    const handleNewChat = () => {
        dispatch(setCurrentChat(null));
    };

    const handleDeleteChat = async (e, chatId) => {
        e.stopPropagation();
        try {
            await apiDeleteChat(chatId);
            dispatch(setChats(chats.filter(c => c._id !== chatId)));
            if (currentChat?._id === chatId) dispatch(setCurrentChat(null));
            showToast("Chat deleted", "success");
        } catch (err) {
            showToast("Failed to delete chat", "error");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi();
            dispatch(logoutAuth());
            showToast("Logged out successfully", "success");
            navigate('/login');
        } catch (err) {
            showToast("Failed to logout", "error");
        }
    };

    return (
        <aside
            className={`
                fixed md:relative z-50 w-64 h-full flex flex-col pt-6 pb-4
                backdrop-blur-xl transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
            style={{
                background: "var(--bg-card)",
                borderRight: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            {/* Header */}
            <div className="px-4 mb-8 flex items-center justify-between">
                <span
                    className="text-3xl font-bold tracking-tight transition-colors"
                    style={{ color: "var(--text-primary)" }}
                >
                    Krt AI
                </span>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="md:hidden p-1.5 rounded-lg transition-colors"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <button
                    onClick={handleNewChat}
                    className="w-full py-3 px-4 rounded-xl flex items-center justify-between group cursor-pointer transition-all duration-200 text-sm font-semibold tracking-wide"
                    style={{
                        background: "var(--gradient-btn)",
                        color: "#fff",
                        boxShadow: "0 4px 15px rgba(99,102,241,0.30)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                    <span>New Chat</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                <h3
                    className="px-4 text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-muted)" }}
                >
                    Library
                </h3>
                <div className="space-y-0.5">
                    {chats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => {
                                dispatch(setCurrentChat(chat));
                                if (window.innerWidth < 768) onClose();
                            }}
                            className="group px-4 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-150 min-w-0"
                            style={
                                currentChat?._id === chat._id
                                    ? {
                                        background: "var(--accent-light)",
                                        color: "var(--accent)",
                                        fontWeight: 600,
                                        borderLeft: "3px solid var(--accent)",
                                    }
                                    : {
                                        color: "var(--text-secondary)",
                                    }
                            }
                            onMouseEnter={e => {
                                if (currentChat?._id !== chat._id) {
                                    e.currentTarget.style.background = "var(--accent-light)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (currentChat?._id !== chat._id) {
                                    e.currentTarget.style.background = "";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }
                            }}
                        >
                            <span className="text-sm truncate min-w-0 flex-1 mr-2">{chat.title}</span>
                            <button
                                onClick={(e) => handleDeleteChat(e, chat._id)}
                                className="p-1 rounded transition-all duration-150 flex-shrink-0"
                                style={{ color: "var(--danger)", opacity: 0.35 }}
                                onMouseEnter={e => {
                                    e.stopPropagation();
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.opacity = "0.35";
                                    e.currentTarget.style.background = "";
                                }}
                                title="Delete chat"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile / Bottom */}
            <div
                className="mt-auto px-4 pt-4"
                style={{ borderTop: "1px solid var(--border-color)" }}
            >
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setShowLogout(!showLogout)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
                        style={{ color: "var(--text-primary)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs uppercase flex-shrink-0 shadow-md"
                            style={{ background: "var(--gradient-btn)" }}
                        >
                            {user?.username?.[0]}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                                {user?.username}
                            </p>
                            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                                {user?.email}
                            </p>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${showLogout ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown */}
                    {showLogout && (
                        <div
                            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden shadow-xl z-50"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                boxShadow: "var(--shadow-card)",
                            }}
                        >
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-150"
                                style={{ color: "var(--danger)" }}
                                onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                                onMouseLeave={e => e.currentTarget.style.background = ""}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
