import { Clock, ExternalLink, Trash2, X } from 'lucide-react';
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
  onDeleteHistory: (id: string) => void;
  refreshTrigger?: number;
}

export default function HistoryPanel({ onSelectHistory, onDeleteHistory, refreshTrigger }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const loadHistory = async () => {
    try {
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('scraping_history')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Then, get the limited history for display
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

  const handleDeleteConfirm = async (id: string) => {
    console.log('🔄 Delete confirmed for ID:', id);
    
    setDeletingId(id);
    setDeleteConfirmId(null);
    
    try {
      // Store the current item for potential rollback
      const itemToDelete = history.find(item => item.id === id);
      
      // Optimistically remove from UI immediately
      setHistory(prev => prev.filter(item => item.id !== id));
      setTotalCount(prev => prev - 1);
      console.log('🎯 Optimistically removed from UI');
      
      // Then call the delete function
      await onDeleteHistory(id);
      console.log('✅ Delete operation completed successfully');
      
    } catch (error) {
      console.error('❌ Delete failed, rolling back:', error);
      // If delete fails, reload the history to get correct state
      await loadHistory();
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🗑️ Delete button clicked for ID:', id);
    setDeleteConfirmId(id);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleItemClick = (id: string) => {
    onSelectHistory(id);
  };

  const handleClearAllClick = async () => {
    // Get the actual total count before showing confirmation
    try {
      const { count, error } = await supabase
        .from('scraping_history')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setTotalCount(count || 0);
      setShowClearAllConfirm(true);
    } catch (error) {
      console.error('Error getting total count:', error);
      // Fallback to current totalCount
      setShowClearAllConfirm(true);
    }
  };

  const handleClearAllConfirm = async () => {
    setClearingAll(true);
    try {
      // Get all history items to delete (not just the displayed ones)
      const { data: allHistoryItems, error } = await supabase
        .from('scraping_history')
        .select('id');

      if (error) throw error;

      // Store current state for potential rollback
      const currentHistory = [...history];
      const currentTotalCount = totalCount;
      
      // Optimistically clear all items from UI
      setHistory([]);
      setTotalCount(0);
      
      // Delete all history items one by one
      if (allHistoryItems && allHistoryItems.length > 0) {
        const deletePromises = allHistoryItems.map(item => onDeleteHistory(item.id));
        await Promise.all(deletePromises);
      }
      
      console.log('✅ All history cleared successfully');
      setShowClearAllConfirm(false);
      
    } catch (error) {
      console.error('❌ Clear all failed, rolling back:', error);
      // If clear all fails, reload the history to get correct state
      await loadHistory();
    } finally {
      setClearingAll(false);
    }
  };

  const handleCancelClearAll = () => {
    setShowClearAllConfirm(false);
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
    <>
      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-auto transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Clear All History
                </h3>
                <button
                  onClick={handleCancelClearAll}
                  disabled={clearingAll}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Are you sure you want to clear all scraping history? This action cannot be undone.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This will delete {totalCount} item{totalCount !== 1 ? 's' : ''} permanently.
                </p>
                {totalCount > 20 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Note: Only 20 most recent items are shown in the list, but all items will be deleted.
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleClearAllConfirm}
                  disabled={clearingAll}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {clearingAll ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Clearing...
                    </>
                  ) : (
                    'Clear All'
                  )}
                </button>
                <button
                  onClick={handleCancelClearAll}
                  disabled={clearingAll}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main History Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent History</h2>
            </div>
            <button
              onClick={handleClearAllClick}
              disabled={history.length === 0}
              className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear All
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto history-scroll-container">
          {history.map((item) => (
            <div key={item.id} className="relative group">
              {deleteConfirmId === item.id ? (
                // Confirmation Box
                <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-400">
                  <p className="text-sm text-gray-900 dark:text-white font-medium mb-3">
                    Delete this history item?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteConfirm(item.id)}
                      disabled={deletingId === item.id}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                    >
                      {deletingId === item.id ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      disabled={deletingId === item.id}
                      className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal History Item
                <div
                  onClick={() => handleItemClick(item.id)}
                  className="w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group relative"
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
                    <div className="flex items-center space-x-1">
                      <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                      <button
                        onClick={(e) => handleDeleteClick(e, item.id)}
                        disabled={deletingId === item.id}
                        className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 disabled:opacity-50"
                        aria-label="Delete history item"
                      >
                        {deletingId === item.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-3 w-3 text-red-500 dark:text-red-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}