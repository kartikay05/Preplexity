import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchChats, deleteChat as apiDeleteChat } from '../service/chat.api';
import { setChats, setCurrentChat, setError } from '../chat.slice';
import { logout as logoutApi } from '../../auth/service/auth.api';
import { logout as logoutAuth } from '../../auth/auth.slice';
import { useCustomToast } from '../../../app/ToastProvider';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chats = useSelector((state) => state.chat.chats);
    const currentChat = useSelector((state) => state.chat.currentChat);
    const user = useSelector((state) => state.auth.user);
    const showToast = useCustomToast();

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
        <aside className="w-64 h-screen border-r border-white/10 bg-zinc-950/50 backdrop-blur-xl flex flex-col pt-6 pb-4">
            {/* New Thread Button */}
            <div className="px-4 mb-8">
                <button 
                    onClick={handleNewChat}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-800/50 border border-white/10 hover:bg-zinc-800 transition-all flex items-center justify-between group cursor-pointer"
                >
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-white">New Thread</span>
                    <span className="text-zinc-500 group-hover:text-zinc-300">Ctrl I</span>
                </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                <h3 className="px-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Library</h3>
                <div className="space-y-1">
                    {chats.map((chat) => (
                        <div 
                            key={chat._id}
                            onClick={() => dispatch(setCurrentChat(chat))}
                            className={`
                                group px-4 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors
                                ${currentChat?._id === chat._id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}
                            `}
                        >
                            <span className="text-sm truncate pr-2">{chat.title}</span>
                            <button 
                                onClick={(e) => handleDeleteChat(e, chat._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile / Bottom */}
            <div className="mt-auto px-4 pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs uppercase">
                        {user?.username?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-lg bg-zinc-800/50 border border-white/10 hover:bg-rose-600/20 hover:border-rose-500/50 transition-all text-sm font-medium text-zinc-300 hover:text-rose-400 flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
