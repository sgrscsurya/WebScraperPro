import { useState } from 'react';
import { Code2, History, Sparkles, Moon, Sun } from 'lucide-react';
import ScraperForm, { ScrapeType } from './components/ScraperForm';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryPanel from './components/HistoryPanel';
import WelcomeLanding from './components/WelcomeLanding';
import { supabase } from './lib/supabase';
import { useTheme } from './contexts/ThemeContext';

interface ScrapingResult {
  id: string;
  url: string;
  scrape_type: string;
  status: string;
  status_code?: number;
  result_data?: any;
  error_message?: string;
  created_at: string;
}

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScrapingResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const handleScrape = async (url: string, scrapeType: ScrapeType) => {
    setLoading(true);
    setCurrentResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/web-scraper`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, scrapeType }),
      });

      const result = await response.json();

      if (result.data) {
        setCurrentResult(result.data);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error(result.error || 'Failed to scrape website');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while scraping');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('scraping_history')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCurrentResult(data);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error loading history item:', error);
    }
  };

  // Show welcome landing page
  if (showWelcome) {
    return <WelcomeLanding onGetStarted={handleGetStarted} />;
  }

  // Original app interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ... rest of your original App.tsx code remains exactly the same ... */}
        <header className="mb-12 text-center relative">
          <button
            onClick={toggleTheme}
            className="absolute top-0 right-0 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
              <Code2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
            Web Scraper Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Extract data from any website with ease. Choose your extraction type and get instant results.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles className="h-4 w-4" />
            <span>Powered by advanced scraping technology</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors">
              <ScraperForm onScrape={handleScrape} loading={loading} />
            </div>

            {loading && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 transition-colors">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600"></div>
                    <Code2 className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Scraping in progress...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyzing the webpage and extracting data</p>
                  </div>
                </div>
              </div>
            )}

            {currentResult && !loading && (
              <ResultsDisplay
                url={currentResult.url}
                scrapeType={currentResult.scrape_type}
                status={currentResult.status}
                statusCode={currentResult.status_code}
                resultData={currentResult.result_data}
                errorMessage={currentResult.error_message}
                createdAt={currentResult.created_at}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lg:hidden w-full flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              >
                <History className="h-5 w-5 mr-2" />
                {showHistory ? 'Hide History' : 'Show History'}
              </button>

              <div className={showHistory ? 'block' : 'hidden lg:block'}>
                <HistoryPanel
                  onSelectHistory={handleSelectHistory}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-3">How It Works</h3>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
                    <span>Enter the URL of the website you want to scrape</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
                    <span>Select the type of data you want to extract</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
                    <span>Click "Start Scraping" and wait for the results</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3 mt-0.5">4</span>
                    <span>Copy or download your extracted data</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Extraction Types</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Full HTML</p>
                    <p className="text-gray-600 dark:text-gray-400">Complete HTML source code</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Text Content</p>
                    <p className="text-gray-600 dark:text-gray-400">All readable text from the page</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Headings</p>
                    <p className="text-gray-600 dark:text-gray-400">All H1 and H2 headings</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Links</p>
                    <p className="text-gray-600 dark:text-gray-400">All anchor tag URLs</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Quotes & Tags</p>
                    <p className="text-gray-600 dark:text-gray-400">Quotes with authors and tags</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 Web Scraper Pro. Built with React, Tailwind CSS, and Supabase.</p>
          <p className="mt-1">Use responsibly and respect website terms of service.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;