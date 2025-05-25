export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      email_logs: {
        Row: {
          error_message: string | null
          estimate_id: string | null
          id: string
          recipient: string
          sent_at: string | null
          status: string | null
          subject: string
          template_data: Json | null
          template_name: string | null
          validation_status: string | null
        }
        Insert: {
          error_message?: string | null
          estimate_id?: string | null
          id?: string
          recipient: string
          sent_at?: string | null
          status?: string | null
          subject: string
          template_data?: Json | null
          template_name?: string | null
          validation_status?: string | null
        }
        Update: {
          error_message?: string | null
          estimate_id?: string | null
          id?: string
          recipient?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_data?: Json | null
          template_name?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string
          details: Json | null
          discount: number | null
          estimated_hours: number
          estimated_paint_gallons: number | null
          id: string
          labor_cost: number
          lead_id: string
          material_cost: number
          notes: string | null
          project_id: string | null
          project_name: string | null
          status: string | null
          status_type: string | null
          subtotal: number | null
          total_cost: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          discount?: number | null
          estimated_hours: number
          estimated_paint_gallons?: number | null
          id?: string
          labor_cost: number
          lead_id: string
          material_cost: number
          notes?: string | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          status_type?: string | null
          subtotal?: number | null
          total_cost: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          discount?: number | null
          estimated_hours?: number
          estimated_paint_gallons?: number | null
          id?: string
          labor_cost?: number
          lead_id?: string
          material_cost?: number
          notes?: string | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          status_type?: string | null
          subtotal?: number | null
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimates_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      extras: {
        Row: {
          category: string
          conditions: string | null
          created_at: string
          id: string
          max_price: number | null
          min_price: number | null
          name: string
          price_type: string
          unit_price: number | null
        }
        Insert: {
          category: string
          conditions?: string | null
          created_at?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          name: string
          price_type: string
          unit_price?: number | null
        }
        Update: {
          category?: string
          conditions?: string | null
          created_at?: string
          id?: string
          max_price?: number | null
          min_price?: number | null
          name?: string
          price_type?: string
          unit_price?: number | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          estimate_id: string
          id: string
          paid_at: string | null
          payment_link: string | null
          status: string | null
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          estimate_id: string
          id?: string
          paid_at?: string | null
          payment_link?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          estimate_id?: string
          id?: string
          paid_at?: string | null
          payment_link?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          details: string | null
          email: string
          id: string
          name: string
          phone: string | null
          project_id: string | null
          project_name: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          project_id?: string | null
          project_name?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      line_items: {
        Row: {
          created_at: string
          description: string
          estimate_id: string
          id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          estimate_id: string
          id?: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          estimate_id?: string
          id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "line_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      paint_types: {
        Row: {
          created_at: string
          description: string | null
          fixed_upcharge: number | null
          id: string
          name: string
          percentage_upcharge: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          fixed_upcharge?: number | null
          id?: string
          name: string
          percentage_upcharge?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          fixed_upcharge?: number | null
          id?: string
          name?: string
          percentage_upcharge?: number | null
        }
        Relationships: []
      }
      portfolio_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          project_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          project_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          base_price: number
          cost_per_sqft: number
          created_at: string
          id: string
          labor_cost_per_hour: number
          material_cost_per_gallon: number
          room_type: string | null
          service_type: string
          updated_at: string
        }
        Insert: {
          base_price: number
          cost_per_sqft: number
          created_at?: string
          id?: string
          labor_cost_per_hour: number
          material_cost_per_gallon: number
          room_type?: string | null
          service_type: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          cost_per_sqft?: number
          created_at?: string
          id?: string
          labor_cost_per_hour?: number
          material_cost_per_gallon?: number
          room_type?: string | null
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          guest_email: string | null
          id: string
          name: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          guest_email?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          guest_email?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      room_addons: {
        Row: {
          addon_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          room_type_id: string | null
          value: number
        }
        Insert: {
          addon_type: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          room_type_id?: string | null
          value: number
        }
        Update: {
          addon_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          room_type_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "room_addons_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_sizes: {
        Row: {
          base_price: number
          created_at: string
          id: string
          room_type_id: string | null
          size: string
        }
        Insert: {
          base_price: number
          created_at?: string
          id?: string
          room_type_id?: string | null
          size: string
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          room_type_id?: string | null
          size?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_sizes_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      special_conditions: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      volume_discounts: {
        Row: {
          created_at: string
          discount_percentage: number
          has_extra: boolean | null
          id: string
          threshold: number
        }
        Insert: {
          created_at?: string
          discount_percentage: number
          has_extra?: boolean | null
          id?: string
          threshold: number
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          has_extra?: boolean | null
          id?: string
          threshold?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_line_items_for_estimate: {
        Args: { estimate_id: string }
        Returns: {
          created_at: string
          description: string
          estimate_id: string
          id: string
          quantity: number
          unit_price: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      import_user_data_by_email: {
        Args: { p_user_id: string; p_email: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
