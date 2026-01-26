export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          condition_type: string
          created_at: string | null
          current_value: number
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          target_id: string
          target_name: string
          threshold_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          condition_type: string
          created_at?: string | null
          current_value: number
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          target_id: string
          target_name: string
          threshold_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          condition_type?: string
          created_at?: string | null
          current_value?: number
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          target_id?: string
          target_name?: string
          threshold_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_reviews: {
        Row: {
          bank_id: string
          comment: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_id: string
          comment: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      banks: {
        Row: {
          created_at: string | null
          established: number | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          established?: number | null
          id: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          established?: number | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      loan_products: {
        Row: {
          bank_id: string | null
          created_at: string | null
          eligibility: string[] | null
          features: string[] | null
          id: string
          interest_rate_max: number | null
          interest_rate_min: number | null
          loan_amount_max: number | null
          loan_amount_min: number | null
          loan_type: string | null
          processing_fee: number | null
          processing_time: string | null
          product_name: string
          required_documents: string[] | null
          tenure_max: number | null
          tenure_min: number | null
          updated_at: string | null
        }
        Insert: {
          bank_id?: string | null
          created_at?: string | null
          eligibility?: string[] | null
          features?: string[] | null
          id: string
          interest_rate_max?: number | null
          interest_rate_min?: number | null
          loan_amount_max?: number | null
          loan_amount_min?: number | null
          loan_type?: string | null
          processing_fee?: number | null
          processing_time?: string | null
          product_name: string
          required_documents?: string[] | null
          tenure_max?: number | null
          tenure_min?: number | null
          updated_at?: string | null
        }
        Update: {
          bank_id?: string | null
          created_at?: string | null
          eligibility?: string[] | null
          features?: string[] | null
          id?: string
          interest_rate_max?: number | null
          interest_rate_min?: number | null
          loan_amount_max?: number | null
          loan_amount_min?: number | null
          loan_type?: string | null
          processing_fee?: number | null
          processing_time?: string | null
          product_name?: string
          required_documents?: string[] | null
          tenure_max?: number | null
          tenure_min?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_products_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
        ]
      }
      nbfis: {
        Row: {
          created_at: string | null
          established: number | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          type: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          established?: number | null
          id: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          established?: number | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      ngos: {
        Row: {
          created_at: string | null
          established: number | null
          focus: string[] | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          established?: number | null
          focus?: string[] | null
          id: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          established?: number | null
          focus?: string[] | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          alert_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          user_id: string
        }
        Insert: {
          alert_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          user_id: string
        }
        Update: {
          alert_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          product_id: string
          product_type: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          product_id: string
          product_type: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          product_id?: string
          product_type?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_products: {
        Row: {
          account_opening_fee: number | null
          bank_id: string | null
          compounding_frequency: string | null
          created_at: string | null
          eligibility: string[] | null
          features: string[] | null
          id: string
          interest_rate: number
          maintenance_fee: number | null
          maximum_deposit: number | null
          minimum_deposit: number | null
          product_name: string
          tenure_max: number | null
          tenure_min: number | null
          updated_at: string | null
          withdrawal_fee: number | null
        }
        Insert: {
          account_opening_fee?: number | null
          bank_id?: string | null
          compounding_frequency?: string | null
          created_at?: string | null
          eligibility?: string[] | null
          features?: string[] | null
          id: string
          interest_rate: number
          maintenance_fee?: number | null
          maximum_deposit?: number | null
          minimum_deposit?: number | null
          product_name: string
          tenure_max?: number | null
          tenure_min?: number | null
          updated_at?: string | null
          withdrawal_fee?: number | null
        }
        Update: {
          account_opening_fee?: number | null
          bank_id?: string | null
          compounding_frequency?: string | null
          created_at?: string | null
          eligibility?: string[] | null
          features?: string[] | null
          id?: string
          interest_rate?: number
          maintenance_fee?: number | null
          maximum_deposit?: number | null
          minimum_deposit?: number | null
          product_name?: string
          tenure_max?: number | null
          tenure_min?: number | null
          updated_at?: string | null
          withdrawal_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "savings_products_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
