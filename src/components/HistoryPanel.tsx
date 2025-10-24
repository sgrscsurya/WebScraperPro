import { Clock, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HistoryItem {
  id: string;
  url: string;
  scrape_type: string;
  status: string;
  created_at: string;
}

interface HistoryPanelProps {
  onSelectHistory: (id: string) => void;
  refreshTrigger?: number;
}

export default function HistoryPanel({ onSelectHistory, refreshTrigger }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scraping_history')
        .select('id, url, scrape_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const formatScrapeType = (type: string) => {
    const typeMap: Record<string, string> = {
      html: 'HTML',
      text: 'Text',
      headings: 'Headings',
      links: 'Links',
      quotes: 'Quotes',
    };
    return typeMap[type] || type;
  };

  const getStatusColor = (status: string) => {
    return status === 'success'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No scraping history yet</p>
          <p className="text-sm mt-1">Your recent scraping sessions will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent History</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectHistory(item.id)}
            className="w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                    {formatScrapeType(item.scrape_type)}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    item.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-200 truncate">{item.url}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
