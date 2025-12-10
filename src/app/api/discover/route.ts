import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio'; // For parsing HTML

// Our list of RSS feeds to monitor
const RSS_FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://openai.com/blog/rss.xml',
  'https://research.google/blog/rss/',
  'https://www.theverge.com/rss/index.xml', // General Verge feed
];

// Helper function to extract main text content from HTML using cheerio and manual timeout
async function getTextContentFromUrl(url: string, timeout = 10000): Promise<string | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id); // Clear the timeout if fetch completes in time

    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to extract main content from common article/blog tags
    const mainContent = $('article, main, .post-content, .entry-content').text();
    if (mainContent.length > 100) { // Basic check for meaningful content
      return mainContent.replace(/\s\s+/g, ' ').trim(); // Remove excessive whitespace
    }
    
    // Fallback to body text if specific content selectors yield little
    const bodyText = $('body').text();
    return bodyText.replace(/\s\s+/g, ' ').trim().substring(0, 5000); // Limit to first 5000 chars

  } catch (error: any) {
    if (error.name === 'AbortError') {
        console.warn(`Fetch for ${url} timed out.`);
    } else {
        console.error(`Error fetching or parsing ${url}:`, error);
    }
    return null;
  } finally {
      clearTimeout(id); // Ensure timeout is cleared even if other errors occur
  }
}

// Custom simplified RSS parser
async function parseRssFeed(feedUrl: string) {
  try {
    const response = await fetch(feedUrl, { signal: AbortSignal.timeout(10000) }); // Use AbortSignal.timeout here as it's a direct XML fetch, less likely to fail
    const xml = await response.text();

    const items: { title: string | undefined; link: string | undefined; }[] = [];
    const feedTitleMatch = xml.match(/<title>(.*?)<\/title>/);
    const feedTitle = feedTitleMatch ? feedTitleMatch[1] : feedUrl;

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);

      items.push({
        title: titleMatch ? titleMatch[1] : 'No Title',
        link: linkMatch ? linkMatch[1] : 'No Link',
      });
    }
    return { title: feedTitle, items };
  } catch (error) {
    console.error(`Error parsing feed ${feedUrl}:`, error);
    return { title: feedUrl, items: [] };
  }
}

export async function GET(request: Request) {
  const discoveredPotentialTools: { title: string | undefined; link: string | undefined; feedTitle: string | undefined; contentSnippet: string | null }[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parseRssFeed(feedUrl); // Use custom parser
      console.log(`[DISCOVERY] Processing feed: ${feed.title || feedUrl}`);

      for (const item of feed.items) {
        const itemLink = item.link;
        if (!itemLink || !item.title) {
            continue; // Skip items without link or title
        }

        // Basic URL screening - filter out github, twitter, policy docs, etc.
        const urlBlacklist = ['github.com', 'twitter.com', 'linkedin.com', 'facebook.com', 'policy', 'terms', 'privacy', 'careers', 'jobs'];
        if (urlBlacklist.some(keyword => itemLink.includes(keyword))) {
            console.log(`[SCREENING] Skipping blacklisted URL: ${itemLink}`);
            continue;
        }

        // Only process links that seem to be articles or product pages (not pure images/videos)
        if (itemLink.match(/\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm|avi|mov)$/i)) {
            console.log(`[SCREENING] Skipping media URL: ${itemLink}`);
            continue;
        }

        console.log(`[DISCOVERY] Found item: ${item.title} - ${itemLink}`);
        
        // --- Web content extraction for LLM ---
        const webpageContent = await getTextContentFromUrl(itemLink);
        if (webpageContent && webpageContent.length > 200) { // Only process if meaningful content was extracted
            // In a real scenario, we'd send webpageContent to an LLM here for analysis
            // For now, we'll just store a snippet of it
            console.log(`[EXTRACTION] Extracted content from ${itemLink}. Length: ${webpageContent.length}`);
            discoveredPotentialTools.push({
                title: item.title,
                link: itemLink,
                feedTitle: feed.title,
                contentSnippet: webpageContent.substring(0, 500) + '...'
            });
        } else {
            console.log(`[EXTRACTION] No meaningful content extracted from ${itemLink} or too short.`);
        }
      }
    } catch (error) {
      console.error(`Error processing feed ${feedUrl}:`, error);
    }
  }

  return NextResponse.json({
    message: 'RSS feed discovery and preliminary content extraction initiated. Check server logs for details.',
    discoveredItemsCount: discoveredPotentialTools.length,
    // discoveredItems: discoveredPotentialTools, // Only return snippet for debugging
  });
}