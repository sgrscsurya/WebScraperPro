/*
  # Web Scraper History Schema

  ## Overview
  Creates the database schema for storing web scraping history and results.

  ## New Tables
  
  ### `scraping_history`
  Stores information about each scraping session including:
  - `id` (uuid, primary key) - Unique identifier for each scraping session
  - `url` (text, not null) - The URL that was scraped
  - `scrape_type` (text, not null) - Type of scraping performed (html, text, headings, links, quotes)
  - `status` (text, not null) - Status of the scrape (success, error)
  - `status_code` (integer) - HTTP status code from the request
  - `result_data` (jsonb) - The scraped data stored as JSON
  - `error_message` (text) - Error message if scraping failed
  - `created_at` (timestamptz) - When the scraping was performed
  - `user_agent` (text) - Browser/user agent information
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `scraping_history` table
  - Public read access is allowed for all scraping history (anonymous users can view)
  - Public insert access is allowed for creating new scraping records (anonymous users can create)
  
  ## Indexes
  - Index on `created_at` for efficient sorting by date
  - Index on `url` for searching by URL
  - Index on `scrape_type` for filtering by scrape type
*/

-- Create scraping_history table
CREATE TABLE IF NOT EXISTS scraping_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  scrape_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  status_code integer,
  result_data jsonb,
  error_message text,
  created_at timestamptz DEFAULT now(),
  user_agent text
);

-- Enable Row Level Security
ALTER TABLE scraping_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view scraping history)
CREATE POLICY "Public read access"
  ON scraping_history
  FOR SELECT
  TO anon
  USING (true);

-- Allow public insert access (anyone can create scraping records)
CREATE POLICY "Public insert access"
  ON scraping_history
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scraping_history_created_at 
  ON scraping_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraping_history_url 
  ON scraping_history(url);

CREATE INDEX IF NOT EXISTS idx_scraping_history_type 
  ON scraping_history(scrape_type);