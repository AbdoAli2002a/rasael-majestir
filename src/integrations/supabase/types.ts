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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      borrow_requests: {
        Row: {
          academic_id: string
          created_at: string
          email: string
          expected_return_date: string
          full_name: string
          id: string
          item_id: string
          phone: string
          status: Database["public"]["Enums"]["borrow_status"]
          updated_at: string
        }
        Insert: {
          academic_id: string
          created_at?: string
          email: string
          expected_return_date: string
          full_name: string
          id?: string
          item_id: string
          phone: string
          status?: Database["public"]["Enums"]["borrow_status"]
          updated_at?: string
        }
        Update: {
          academic_id?: string
          created_at?: string
          email?: string
          expected_return_date?: string
          full_name?: string
          id?: string
          item_id?: string
          phone?: string
          status?: Database["public"]["Enums"]["borrow_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "borrow_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      edu_tech_research: {
        Row: {
          author: string
          created_at: string
          download_url: string | null
          id: string
          serial_number: number | null
          source: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          author: string
          created_at?: string
          download_url?: string | null
          id?: string
          serial_number?: number | null
          source?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          author?: string
          created_at?: string
          download_url?: string | null
          id?: string
          serial_number?: number | null
          source?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      free_edu_tech_books: {
        Row: {
          author: string
          created_at: string
          description: string | null
          download_url: string | null
          id: string
          serial_number: number | null
          source: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          author: string
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          serial_number?: number | null
          source?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          author?: string
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          serial_number?: number | null
          source?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      library_items: {
        Row: {
          author: string
          created_at: string
          id: string
          issue: string | null
          journal_name: string | null
          publication_place: string | null
          publisher: string | null
          sub_category: string | null
          supervisors: string | null
          title: string
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string
          volume: string | null
          year: number | null
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          issue?: string | null
          journal_name?: string | null
          publication_place?: string | null
          publisher?: string | null
          sub_category?: string | null
          supervisors?: string | null
          title: string
          type: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          volume?: string | null
          year?: number | null
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          issue?: string | null
          journal_name?: string | null
          publication_place?: string | null
          publisher?: string | null
          sub_category?: string | null
          supervisors?: string | null
          title?: string
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          volume?: string | null
          year?: number | null
        }
        Relationships: []
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
      borrow_status: "pending" | "approved" | "rejected" | "returned"
      item_type: "phd_thesis" | "master_thesis" | "book" | "research"
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
      borrow_status: ["pending", "approved", "rejected", "returned"],
      item_type: ["phd_thesis", "master_thesis", "book", "research"],
    },
  },
} as const
