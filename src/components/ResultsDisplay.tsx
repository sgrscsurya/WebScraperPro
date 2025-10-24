import { CheckCircle2, XCircle, Copy, Download, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ResultsDisplayProps {
  url: string;
  scrapeType: string;
  status: string;
  statusCode?: number;
  resultData?: any;
  errorMessage?: string;
  createdAt: string;
}

export default function ResultsDisplay({
  url,
  scrapeType,
  status,
  statusCode,
  resultData,
  errorMessage,
  createdAt,
}: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const content = typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrape-${scrapeType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatScrapeType = (type: string) => {
    const typeMap: Record<string, string> = {
      html: 'Full HTML',
      text: 'Text Content',
      headings: 'Headings',
      links: 'Links',
      quotes: 'Quotes & Tags',
    };
    return typeMap[type] || type;
  };

  const renderContent = () => {
    if (status === 'error') {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start">
            <XCircle className="h-6 w-6 text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">Scraping Failed</h3>
              <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        </div>
      );
    }

    if (scrapeType === 'quotes' && Array.isArray(resultData)) {
      return (
        <div className="space-y-4">
          {resultData.map((quote: any, index: number) => (
            <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow">
              <blockquote className="text-lg text-gray-800 dark:text-gray-200 italic mb-3">
                "{quote.quote}"
              </blockquote>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">— {quote.author}</p>
              <div className="flex flex-wrap gap-2">
                {quote.tags?.map((tag: string, tagIndex: number) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (scrapeType === 'links' && Array.isArray(resultData)) {
      return (
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="space-y-2">
            {resultData.map((link: string, index: number) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline py-2 break-all group"
              >
                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                {link}
              </a>
            ))}
          </div>
        </div>
      );
    }

    if (scrapeType === 'headings' && Array.isArray(resultData)) {
      return (
        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 space-y-3">
          {resultData.map((heading: string, index: number) => (
            <div key={index} className="py-2 border-b border-gray-100 dark:border-gray-600 last:border-0">
              <p className="text-gray-800 dark:text-gray-200 font-medium">{heading}</p>
            </div>
          ))}
        </div>
      );
    }

    const content = typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2);

    return (
      <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 overflow-x-auto">
        <pre className="text-gray-100 dark:text-gray-200 text-sm font-mono whitespace-pre-wrap break-words">
          {content}
        </pre>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scraping Complete</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Extracted {formatScrapeType(scrapeType)} from{' '}
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {url}
                </a>
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Status Code: {statusCode}</span>
                <span>•</span>
                <span>{new Date(createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className={`h-5 w-5 ${copied ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Download results"
            >
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}
