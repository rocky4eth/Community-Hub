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
      profiles: {
        Row: {
          id: string
          created_at: string
          wallet_address: string
          city: string
          country: string
          bio: string | null
          metadata_uri: string
          verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          wallet_address: string
          city: string
          country: string
          bio?: string | null
          metadata_uri: string
          verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          wallet_address?: string
          city?: string
          country?: string
          bio?: string | null
          metadata_uri?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}