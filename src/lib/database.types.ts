export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      scraping_history: {
        Row: {
          id: string
          url: string
          scrape_type: string
          status: string
          status_code: number | null
          result_data: Json | null
          error_message: string | null
          created_at: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          url: string
          scrape_type: string
          status?: string
          status_code?: number | null
          result_data?: Json | null
          error_message?: string | null
          created_at?: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          url?: string
          scrape_type?: string
          status?: string
          status_code?: number | null
          result_data?: Json | null
          error_message?: string | null
          created_at?: string
          user_agent?: string | null
        }
      }
    }
  }
}
