import axios from 'axios';

/**
 * Search the web using Serper.dev Google Search API
 * @param {string} query - The user's search query
 * @param {number} numResults - Number of results to return (default: 5)
 * @returns {Promise<Array<{title: string, url: string, snippet: string}>>}
 */

export async function searchWeb(query, numResults = 5) {
    try {
        const response = await axios.post(
            'https://google.serper.dev/search',
            {
                q: query,
                num: numResults,
            },
            {
                headers: {
                    'X-API-KEY': process.env.SERPER_API_KEY,
                    'Content-Type': 'application/json',
                },
                timeout: 5000,
            }
        );

        const organic = response.data?.organic || [];

        return organic.slice(0, numResults).map((result) => ({
            title: result.title || '',
            url: result.link || '',
            snippet: result.snippet || '',
        }));
    } catch (error) {
        console.error('Web search failed:', error.message);
        return [];
    }
}
