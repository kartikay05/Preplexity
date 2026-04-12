import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrape readable text content from a URL
 * @param {string} url - The URL to scrape
 * @param {number} maxChars - Maximum characters to extract (default: 3000)
 * @returns {Promise<{url: string, content: string, success: boolean}>}
 */
export async function scrapeUrl(url, maxChars = 3000) {
    try {
        const response = await axios.get(url, {
            timeout: 8000,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                Accept: 'text/html,application/xhtml+xml',
            },
            maxRedirects: 3,
        });

        const html = response.data;

        if (typeof html !== 'string') {
            return { url, content: '', success: false };
        }

        const $ = cheerio.load(html);

        // Remove unwanted elements
        $(
            'script, style, nav, footer, header, aside, iframe, noscript, svg, form, button, [role="navigation"], [role="banner"], [role="contentinfo"], .sidebar, .nav, .menu, .footer, .header, .ad, .ads, .advertisement, .cookie, .popup, .modal'
        ).remove();

        // Extract text from main content areas first, fallback to body
        let text = '';

        const contentSelectors = [
            'article',
            'main',
            '[role="main"]',
            '.content',
            '.post',
            '.article',
            '#content',
            '#main',
        ];

        for (const selector of contentSelectors) {
            const el = $(selector);
            if (el.length && el.text().trim().length > 200) {
                text = el.text();
                break;
            }
        }

        // Fallback to body
        if (!text) {
            text = $('body').text();
        }

        // Clean up whitespace
        text = text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();

        // Limit to maxChars
        if (text.length > maxChars) {
            text = text.substring(0, maxChars) + '...';
        }

        return { url, content: text, success: text.length > 50 };
    } catch (error) {
        console.error(`Scraping failed for ${url}:`, error.message);
        return { url, content: '', success: false };
    }
}

/**
 * Scrape multiple URLs in parallel
 * @param {Array<{title: string, url: string, snippet: string}>} searchResults
 * @returns {Promise<Array<{url: string, title: string, content: string, snippet: string}>>}
 */
export async function scrapeMultipleUrls(searchResults) {
    const scrapePromises = searchResults.map(async (result) => {
        const scraped = await scrapeUrl(result.url);
        return {
            url: result.url,
            title: result.title,
            snippet: result.snippet,
            content: scraped.success ? scraped.content : result.snippet,
        };
    });

    const results = await Promise.allSettled(scrapePromises);

    return results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
        .filter((r) => r.content && r.content.length > 20);
}
