import { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';

export type ScrapeType = 'html' | 'text' | 'headings' | 'links' | 'quotes';

interface ScraperFormProps {
  onScrape: (url: string, scrapeType: ScrapeType) => Promise<void>;
  loading: boolean;
}

export default function ScraperForm({ onScrape, loading }: ScraperFormProps) {
  const [url, setUrl] = useState('');
  const [scrapeType, setScrapeType] = useState<ScrapeType>('text');
  const [error, setError] = useState('');

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    await onScrape(url, scrapeType);
  };

  const scrapeOptions = [
    { value: 'html', label: 'Full HTML Code', description: 'Extract complete HTML structure' },
    { value: 'text', label: 'All Text Content', description: 'Extract all readable text' },
    { value: 'headings', label: 'Headings Only', description: 'Extract H1 and H2 headings' },
    { value: 'links', label: 'All Links', description: 'Extract all anchor tag URLs' },
    { value: 'quotes', label: 'Quotes & Tags', description: 'Extract quotes with authors and tags' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website URL
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Extraction Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scrapeOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                scrapeType === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="scrapeType"
                value={option.value}
                checked={scrapeType === option.value}
                onChange={(e) => setScrapeType(e.target.value as ScrapeType)}
                disabled={loading}
                className="sr-only"
              />
              <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Scraping...
          </>
        ) : (
          'Start Scraping'
        )}
      </button>
    </form>
  );
}
