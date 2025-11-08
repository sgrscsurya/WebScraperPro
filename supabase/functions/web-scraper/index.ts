import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScrapeRequest {
  url: string;
  scrapeType: string;
}

interface ParsedQuote {
  quote: string;
  author: string;
  tags: string[];
}

class DOMParser {
  constructor() {}

  parseFromString(html: string, type: string): Document {
    const textContent = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    return {
      querySelectorAll: (selector: string) => {
        const elements: any[] = [];
        
        if (selector === 'span.text') {
          const quoteRegex = /<span class="text" itemprop="text">(.*?)<\/span>/gs;
          let match;
          while ((match = quoteRegex.exec(html)) !== null) {
            elements.push({ textContent: match[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
          }
        }
        
        if (selector === 'small.author') {
          const authorRegex = /<small class="author" itemprop="author">(.*?)<\/small>/gs;
          let match;
          while ((match = authorRegex.exec(html)) !== null) {
            elements.push({ textContent: match[1] });
          }
        }
        
        if (selector === 'div.tags') {
          const tagsBlockRegex = /<div class="tags">(.*?)<\/div>/gs;
          let match;
          while ((match = tagsBlockRegex.exec(html)) !== null) {
            const tagsHtml = match[1];
            const tagRegex = /<a class="tag" href="[^"]*">(.*?)<\/a>/g;
            const tags: any[] = [];
            let tagMatch;
            while ((tagMatch = tagRegex.exec(tagsHtml)) !== null) {
              tags.push({ textContent: tagMatch[1] });
            }
            elements.push({
              querySelectorAll: () => tags
            });
          }
        }
        
        if (selector === 'a') {
          const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>/gi;
          let match;
          while ((match = linkRegex.exec(html)) !== null) {
            elements.push({ getAttribute: () => match[1] });
          }
        }
        
        if (selector === 'h1, h2') {
          const h1Regex = /<h1[^>]*>(.*?)<\/h1>/gs;
          const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gs;
          let match;
          while ((match = h1Regex.exec(html)) !== null) {
            const text = match[1].replace(/<[^>]*>/g, '').trim();
            if (text) elements.push({ textContent: text });
          }
          while ((match = h2Regex.exec(html)) !== null) {
            const text = match[1].replace(/<[^>]*>/g, '').trim();
            if (text) elements.push({ textContent: text });
          }
        }
        
        return elements;
      },
      body: {
        get textContent() {
          return textContent
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
    } as any;
  }
}

async function scrapeWebsite(url: string, scrapeType: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Unable to fetch the webpage`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  switch (scrapeType) {
    case 'html':
      return html;

    case 'text': {
      return doc.body.textContent;
    }

    case 'headings': {
      const headings = doc.querySelectorAll('h1, h2');
      return Array.from(headings)
        .map((h: any) => h.textContent.trim())
        .filter(text => text.length > 0);
    }

    case 'links': {
      const links = doc.querySelectorAll('a');
      return Array.from(links)
        .map((a: any) => a.getAttribute('href'))
        .filter((href: string | null) => href && href.length > 0);
    }

    case 'quotes': {
      const quotes = doc.querySelectorAll('span.text');
      const authors = doc.querySelectorAll('small.author');
      const tagsContainers = doc.querySelectorAll('div.tags');

      const results: ParsedQuote[] = [];

      for (let i = 0; i < quotes.length; i++) {
        const quoteText = quotes[i].textContent.trim();
        const authorText = authors[i]?.textContent.trim() || 'Unknown';
        
        const tagElements = tagsContainers[i]?.querySelectorAll('a.tag') || [];
        const tags = Array.from(tagElements).map((tag: any) => tag.textContent.trim());

        results.push({
          quote: quoteText,
          author: authorText,
          tags: tags,
        });
      }

      return results;
    }

    default:
      throw new Error('Invalid scrape type');
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
  Deno.env.get('PROJECT_URL') ?? '',
  Deno.env.get('SERVICE_ROLE_KEY') ?? ''
);


    const { url, scrapeType }: ScrapeRequest = await req.json();

    if (!url || !scrapeType) {
      return new Response(
        JSON.stringify({ error: 'Missing url or scrapeType' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let statusCode = 0;
    let resultData = null;
    let status = 'success';
    let errorMessage = null;

    try {
      const testResponse = await fetch(url, { method: 'HEAD' });
      statusCode = testResponse.status;

      if (statusCode !== 200) {
        throw new Error(`Website returned status code ${statusCode}`);
      }

      resultData = await scrapeWebsite(url, scrapeType);
    } catch (error) {
      status = 'error';
      errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      statusCode = statusCode || 0;
    }

    const { data: historyData, error: dbError } = await supabase
      .from('scraping_history')
      .insert({
        url,
        scrape_type: scrapeType,
        status,
        status_code: statusCode,
        result_data: resultData,
        error_message: errorMessage,
        user_agent: req.headers.get('user-agent'),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({
        success: status === 'success',
        data: historyData,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});