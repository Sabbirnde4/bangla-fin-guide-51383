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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      banks: {
        Row: {
          created_at: string
          established: number | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          established?: number | null
          id?: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          established?: number | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      loan_products: {
        Row: {
          bank_id: string
          created_at: string
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
          updated_at: string
        }
        Insert: {
          bank_id: string
          created_at?: string
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
          product_name: string
          required_documents?: string[] | null
          tenure_max?: number | null
          tenure_min?: number | null
          updated_at?: string
        }
        Update: {
          bank_id?: string
          created_at?: string
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
          updated_at?: string
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
          created_at: string
          established: number | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          established?: number | null
          id: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          established?: number | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      ngos: {
        Row: {
          created_at: string
          established: number | null
          focus: string[] | null
          id: string
          logo: string | null
          name: string
          rating: number | null
          total_branches: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          established?: number | null
          focus?: string[] | null
          id: string
          logo?: string | null
          name: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          established?: number | null
          focus?: string[] | null
          id?: string
          logo?: string | null
          name?: string
          rating?: number | null
          total_branches?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_products: {
        Row: {
          account_opening_fee: number | null
          bank_id: string
          compounding_frequency: string | null
          created_at: string
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
          updated_at: string
          withdrawal_fee: number | null
        }
        Insert: {
          account_opening_fee?: number | null
          bank_id: string
          compounding_frequency?: string | null
          created_at?: string
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
          updated_at?: string
          withdrawal_fee?: number | null
        }
        Update: {
          account_opening_fee?: number | null
          bank_id?: string
          compounding_frequency?: string | null
          created_at?: string
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
          updated_at?: string
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
      user_favorites: {
        Row: {
          bank_id: string | null
          created_at: string
          id: string
          loan_product_id: string | null
          user_id: string
        }
        Insert: {
          bank_id?: string | null
          created_at?: string
          id?: string
          loan_product_id?: string | null
          user_id: string
        }
        Update: {
          bank_id?: string | null
          created_at?: string
          id?: string
          loan_product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_loan_product_id_fkey"
            columns: ["loan_product_id"]
            isOneToOne: false
            referencedRelation: "loan_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_first_admin: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_any_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
