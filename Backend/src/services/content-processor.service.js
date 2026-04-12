/**
 * Chunk text into segments of approximately chunkSize characters
 * Tries to break at sentence boundaries
 */
function chunkText(text, chunkSize = 500) {
    const chunks = [];
    let start = 0;

    while (start < text.length) {
        let end = start + chunkSize;

        if (end >= text.length) {
            chunks.push(text.substring(start).trim());
            break;
        }

        // Try to break at a sentence boundary (. ! ? \n)
        const searchWindow = text.substring(end - 80, end + 80);
        const sentenceBreak = searchWindow.search(/[.!?\n]\s/);

        if (sentenceBreak !== -1) {
            end = end - 80 + sentenceBreak + 1;
        }

        chunks.push(text.substring(start, end).trim());
        start = end;
    }

    return chunks.filter((c) => c.length > 20);
}

/**
 * Score a chunk based on keyword relevance to the query
 */
function scoreChunk(chunk, queryWords) {
    const lowerChunk = chunk.toLowerCase();
    let score = 0;

    for (const word of queryWords) {
        const regex = new RegExp(word.toLowerCase(), 'gi');
        const matches = lowerChunk.match(regex);
        if (matches) {
            score += matches.length;
        }
    }

    // Bonus for longer chunks (more context)
    score += Math.min(chunk.length / 500, 1) * 0.5;

    return score;
}

/**
 * Process scraped content into relevant chunks for the LLM
 * @param {Array<{url: string, title: string, content: string, snippet: string}>} scrapedResults
 * @param {string} query - The user's original query
 * @param {number} maxTotalChars - Maximum total characters for the context
 * @returns {{context: string, sources: Array<{title: string, url: string, snippet: string}>}}
 */
export function processContent(scrapedResults, query, maxTotalChars = 6000) {
    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 2);

    // Chunk and score all content
    const allChunks = [];

    for (const result of scrapedResults) {
        const chunks = chunkText(result.content);

        for (const chunk of chunks) {
            allChunks.push({
                text: chunk,
                score: scoreChunk(chunk, queryWords),
                source: {
                    title: result.title,
                    url: result.url,
                    snippet: result.snippet,
                },
            });
        }
    }

    // Sort by relevance score (descending)
    allChunks.sort((a, b) => b.score - a.score);

    // Select top chunks within token limit
    const selectedChunks = [];
    let totalChars = 0;
    const usedSources = new Map();

    for (const chunk of allChunks) {
        if (totalChars + chunk.text.length > maxTotalChars) break;

        selectedChunks.push(chunk);
        totalChars += chunk.text.length;

        // Track unique sources
        if (!usedSources.has(chunk.source.url)) {
            usedSources.set(chunk.source.url, chunk.source);
        }
    }

    // Build context string with source labels
    const sources = Array.from(usedSources.values());

    let context = '';
    for (let i = 0; i < selectedChunks.length; i++) {
        const chunk = selectedChunks[i];
        const sourceIndex = sources.findIndex((s) => s.url === chunk.source.url);
        context += `[Source ${sourceIndex + 1}: ${chunk.source.title}]\n${chunk.text}\n\n`;
    }

    return { context: context.trim(), sources };
}
