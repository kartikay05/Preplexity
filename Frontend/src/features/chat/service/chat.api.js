import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

export const fetchChats = async () => {
    const response = await api.get('/api/chats');
    return response.data;
};

export const fetchMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
};

export const sendMessage = async ({ message, chat }) => {
    const response = await api.post('/api/chats/message', { message, chat });
    return response.data;
};

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`);
    return response.data;
};
