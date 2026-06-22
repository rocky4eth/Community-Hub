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
          name: string | null
          guide: boolean | null
          connections: number | null
          answered: number | null
          cities: number | null
          avatar_url: string | null
          txid: string
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
          name?: string | null
          guide?: boolean | null
          connections?: number | null
          answered?: number | null
          cities?: number | null
          avatar_url?: string | null
          txid: string
        }
        Update: {
          city?: string
          country?: string
          bio?: string | null
          metadata_uri?: string
          verified?: boolean
          name?: string | null
          guide?: boolean | null
          connections?: number | null
          answered?: number | null
          cities?: number | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          created_at: string
          author_address: string
          type: 'REQUEST' | 'OFFER'
          city: string
          message: string
          txid: string
          deleted: boolean
          notice_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          author_address: string
          type: 'REQUEST' | 'OFFER'
          city: string
          message: string
          txid: string
          notice_id: string
        }
        Update: {
          id?: string
          type?: 'REQUEST' | 'OFFER'
          city?: string
          message?: string
          txid?: string
          deleted?: boolean
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