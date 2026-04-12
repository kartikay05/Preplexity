import { generateChatTitle, generateSearchResponse, generateResponse } from "../services/ai.service.js";
import { searchWeb } from "../services/web-search.service.js";
import { scrapeMultipleUrls } from "../services/scraper.service.js";
import { processContent } from "../services/content-processor.service.js";
import chatModel from '../models/chat.model.js'
import messageModel from '../models/message.model.js'


export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body

    try {
        let title = null, chat = null
        if (!chatId) {
            title = await generateChatTitle(message)
            chat = await chatModel.create({
                user: req.user.id,
                title
            })
        }

        const activeChatId = chatId || chat._id;

        // Save user message
        const userMessage = await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        })

        // ── Perplexity-style Search Pipeline ──

        // Step 1: Search the web
        const searchResults = await searchWeb(message, 5);

        let aiContent = '';
        let sources = [];

        if (searchResults.length > 0) {
            // Step 2: Scrape content from top URLs
            const scrapedContent = await scrapeMultipleUrls(searchResults);

            // Step 3: Process & chunk content
            const processed = processContent(scrapedContent, message);

            sources = processed.sources;

            // Step 4: Get conversation history for context
            const chatHistory = await messageModel
                .find({ chat: activeChatId })
                .sort({ createdAt: -1 })
                .limit(6)
                .lean();

            chatHistory.reverse();

            // Step 5: Generate AI response with web context
            aiContent = await generateSearchResponse(
                message,
                processed.context,
                sources,
                chatHistory
            );
        } else {
            // Fallback: no search results, use basic generation
            const messages = await messageModel.find({ chat: activeChatId });
            aiContent = await generateResponse(messages);
        }

        // Save AI message with sources
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: aiContent,
            role: "ai",
            sources: sources.map(s => ({
                title: s.title,
                url: s.url,
                snippet: s.snippet
            }))
        })

        res.status(201).json({
            title,
            chat: chat || { _id: chatId },
            aiMessage,
        })

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate response",
            error: error.message
        });
    }
}

export async function getChats(req, res) {
    const user = req.user;

    const chat = await chatModel.find({ user: user.id }).sort({ updatedAt: -1 })

    res.status(201).json({
        message: "Chats retrieved successfully",
        chat
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.find({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "chat not found!"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved Successfully!",
        messages
    })
}


export async function deleteChat(req, res) {
    const { chatId } = req.params

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    const message = await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "chat not found"
        })
    }


    res.status(200).json({
        message: "Chat deleted Successfully!"
    })
}