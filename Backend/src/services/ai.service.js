import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from 'langchain';

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralaimodel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

/**
 * Generate an AI response using web context (Perplexity-style)
 * @param {string} query - The user's question
 * @param {string} webContext - Processed web content with source labels
 * @param {Array} sources - Array of source objects
 * @param {Array} chatHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI-generated answer
 */
export async function generateSearchResponse(query, webContext, sources, chatHistory = []) {
    const sourceList = sources
        .map((s, i) => `[Source ${i + 1}]: ${s.title} — ${s.url}`)
        .join('\n');

    const systemPrompt = `You are KRT AI, an intelligent search assistant similar to Perplexity AI. Your job is to provide accurate, well-structured answers based ONLY on the provided web context.

CRITICAL RULES:
1. ONLY use information from the provided web context below. Do NOT use your internal training knowledge.
2. NEVER hallucinate or make up information that isn't in the context.
3. Always cite your sources using numbered references like [1], [2], etc.
4. If the context doesn't contain enough information to answer, say so honestly.
5. Format your response in clean Markdown with proper headings, bullet points, and bold text.
6. Be concise but comprehensive — aim for clear, informative answers.
7. At the END of your answer, include a "Sources" section listing all referenced sources.

AVAILABLE SOURCES:
${sourceList}

WEB CONTEXT:
${webContext}`;

    const messages = [
        new SystemMessage(systemPrompt),
    ];

    // Add conversation history (limited to last 4 messages for context)
    const recentHistory = chatHistory.slice(-4);
    for (const msg of recentHistory) {
        if (msg.role === "user") {
            messages.push(new HumanMessage(msg.content));
        } else if (msg.role === "ai") {
            messages.push(new AIMessage(msg.content));
        }
    }

    // Add current query
    messages.push(new HumanMessage(query));

    const response = await geminiModel.invoke(messages);

    return response.text;
}

/**
 * Generate a simple response without web context (fallback)
 */
export async function generateResponse(messages) {

    const response = await geminiModel.invoke(messages.map(msg => {
        if (msg.role == "user") {
            return new HumanMessage(msg.content)
        } else if (msg.role == "ai") {
            return new AIMessage(msg.content)
        }
    }))

    return response.text
}

export async function generateChatTitle(message) {
    const response = await mistralaimodel.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-5 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            ${message}
            `)
    ])

    return response.text.replace(/^["']+|["']+$/g, '').trim();
}