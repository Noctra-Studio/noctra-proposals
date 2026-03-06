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
      contracts: {
        Row: {
          id: string
          proposal_id: string | null
          slug: string
          status: string
          client_name: string
          client_company: string | null
          client_rfc: string | null
          client_address: string | null
          client_email: string
          project_name: string
          services: Json
          total: number
          payment_schedule: Json
          estimated_weeks: number
          buffer_weeks: number
          total_weeks: number
          start_date: string
          estimated_end_date: string
          signed_at: string | null
          client_signed_name: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          proposal_id?: string | null
          slug: string
          status?: string
          client_name: string
          client_company?: string | null
          client_rfc?: string | null
          client_address?: string | null
          client_email: string
          project_name: string
          services: Json
          total: number
          payment_schedule: Json
          estimated_weeks: number
          buffer_weeks: number
          total_weeks: number
          start_date: string
          estimated_end_date: string
          signed_at?: string | null
          client_signed_name?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string | null
          slug?: string
          status?: string
          client_name?: string
          client_company?: string | null
          client_rfc?: string | null
          client_address?: string | null
          client_email?: string
          project_name?: string
          services?: Json
          total?: number
          payment_schedule?: Json
          estimated_weeks?: number
          buffer_weeks?: number
          total_weeks?: number
          start_date?: string
          estimated_end_date?: string
          signed_at?: string | null
          client_signed_name?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
          Row: any
          Insert: any
          Update: any
      }
      proposal_history: {
          Row: any
          Insert: any
          Update: any
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
  }
}