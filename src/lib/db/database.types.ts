export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
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
  public: {
    Tables: {
      agreement: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          landlord_id: string
          rent: number
          rent_due_day: number
          start_date: string
          tenancy_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          landlord_id: string
          rent: number
          rent_due_day?: number
          start_date: string
          tenancy_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          landlord_id?: string
          rent?: number
          rent_due_day?: number
          start_date?: string
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreement_tenancy_id_landlord_id_fkey"
            columns: ["tenancy_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "tenancy"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      audit_event: {
        Row: {
          actor_id: string | null
          actor_type: string | null
          body: string | null
          created_at: string
          entity_id: string
          entity_type: string
          event_type: string
          id: string
          is_protected: boolean
          landlord_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string | null
          body?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          event_type: string
          id?: string
          is_protected?: boolean
          landlord_id: string
        }
        Update: {
          actor_id?: string | null
          actor_type?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          event_type?: string
          id?: string
          is_protected?: boolean
          landlord_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_event_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["id"]
          },
        ]
      }
      document: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          is_protected: boolean
          landlord_id: string
          owner_id: string
          owner_type: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          file_url: string
          id?: string
          is_protected?: boolean
          landlord_id: string
          owner_id: string
          owner_type: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          is_protected?: boolean
          landlord_id?: string
          owner_id?: string
          owner_type?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["id"]
          },
        ]
      }
      landlord: {
        Row: {
          accountant_email: string | null
          business_name: string | null
          created_at: string
          escalation_default_pct: number | null
          id: string
          logo_url: string | null
          next_receipt_seq: number
          next_request_seq: number
          receipt_name: string | null
          reminder_day_direct: number
          reminder_day_formal: number
          reminder_day_gentle: number
          upi_id: string | null
        }
        Insert: {
          accountant_email?: string | null
          business_name?: string | null
          created_at?: string
          escalation_default_pct?: number | null
          id: string
          logo_url?: string | null
          next_receipt_seq?: number
          next_request_seq?: number
          receipt_name?: string | null
          reminder_day_direct?: number
          reminder_day_formal?: number
          reminder_day_gentle?: number
          upi_id?: string | null
        }
        Update: {
          accountant_email?: string | null
          business_name?: string | null
          created_at?: string
          escalation_default_pct?: number | null
          id?: string
          logo_url?: string | null
          next_receipt_seq?: number
          next_request_seq?: number
          receipt_name?: string | null
          reminder_day_direct?: number
          reminder_day_formal?: number
          reminder_day_gentle?: number
          upi_id?: string | null
        }
        Relationships: []
      }
      landlord_signin_attempt: {
        Row: {
          email: string
          failed_count: number
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          email: string
          failed_count?: number
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          email?: string
          failed_count?: number
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_request: {
        Row: {
          category: string
          closed_at: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          landlord_id: string
          no_cost: boolean
          reported_by: string | null
          reporter_name: string | null
          reporter_phone: string | null
          request_number: string | null
          status: string
          tenancy_id: string | null
          tenant_liable: boolean
          unit_id: string
          urgency: string
          vendor_name: string | null
          vendor_phone: string | null
        }
        Insert: {
          category: string
          closed_at?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          landlord_id: string
          no_cost?: boolean
          reported_by?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          request_number?: string | null
          status?: string
          tenancy_id?: string | null
          tenant_liable?: boolean
          unit_id: string
          urgency?: string
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Update: {
          category?: string
          closed_at?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          landlord_id?: string
          no_cost?: boolean
          reported_by?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          request_number?: string | null
          status?: string
          tenancy_id?: string | null
          tenant_liable?: boolean
          unit_id?: string
          urgency?: string
          vendor_name?: string | null
          vendor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_request_tenancy_id_landlord_id_fkey"
            columns: ["tenancy_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "tenancy"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "maintenance_request_unit_id_landlord_id_fkey"
            columns: ["unit_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number
          created_at: string
          id: string
          landlord_id: string
          payment_reference: string | null
          receipt_number: string | null
          received_date: string
          rent_entry_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          landlord_id: string
          payment_reference?: string | null
          receipt_number?: string | null
          received_date?: string
          rent_entry_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          landlord_id?: string
          payment_reference?: string | null
          receipt_number?: string | null
          received_date?: string
          rent_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_rent_entry_id_landlord_id_fkey"
            columns: ["rent_entry_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "rent_entry"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      property: {
        Row: {
          address: string
          created_at: string
          id: string
          landlord_id: string
          name: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          landlord_id: string
          name: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          landlord_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_entry: {
        Row: {
          created_at: string
          due_date: string
          id: string
          is_pro_rata: boolean
          landlord_id: string
          period_month: string
          rent_due: number
          tenancy_id: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: string
          is_pro_rata?: boolean
          landlord_id: string
          period_month: string
          rent_due: number
          tenancy_id: string
          unit_id: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          is_pro_rata?: boolean
          landlord_id?: string
          period_month?: string
          rent_due?: number
          tenancy_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_entry_tenancy_id_landlord_id_fkey"
            columns: ["tenancy_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "tenancy"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "rent_entry_unit_id_landlord_id_fkey"
            columns: ["unit_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      settlement: {
        Row: {
          agreement_id: string | null
          created_at: string
          deposit_held: number
          document_id: string | null
          id: string
          landlord_id: string
          settled_at: string | null
          status: string
          supersedes_settlement_id: string | null
          tenancy_id: string
        }
        Insert: {
          agreement_id?: string | null
          created_at?: string
          deposit_held: number
          document_id?: string | null
          id?: string
          landlord_id: string
          settled_at?: string | null
          status?: string
          supersedes_settlement_id?: string | null
          tenancy_id: string
        }
        Update: {
          agreement_id?: string | null
          created_at?: string
          deposit_held?: number
          document_id?: string | null
          id?: string
          landlord_id?: string
          settled_at?: string | null
          status?: string
          supersedes_settlement_id?: string | null
          tenancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_agreement_id_landlord_id_fkey"
            columns: ["agreement_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "agreement"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "settlement_document_id_landlord_id_fkey"
            columns: ["document_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "document"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "settlement_supersedes_settlement_id_landlord_id_fkey"
            columns: ["supersedes_settlement_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "settlement"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "settlement_tenancy_id_landlord_id_fkey"
            columns: ["tenancy_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "tenancy"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      settlement_deduction: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          landlord_id: string
          photo_document_id: string | null
          reason: string
          settlement_id: string
          source_maintenance_request_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          landlord_id: string
          photo_document_id?: string | null
          reason: string
          settlement_id: string
          source_maintenance_request_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          landlord_id?: string
          photo_document_id?: string | null
          reason?: string
          settlement_id?: string
          source_maintenance_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlement_deduction_photo_document_id_landlord_id_fkey"
            columns: ["photo_document_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "document"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "settlement_deduction_settlement_id_landlord_id_fkey"
            columns: ["settlement_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "settlement"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "settlement_deduction_source_maintenance_request_id_landlor_fkey"
            columns: ["source_maintenance_request_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "maintenance_request"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      tenancy: {
        Row: {
          created_at: string
          deposit_amount: number
          deposit_received_date: string | null
          id: string
          landlord_id: string
          move_out_date: string | null
          notice_given: boolean
          notice_given_date: string | null
          started_at: string
          tenant_id: string
          tenant_token: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          deposit_amount: number
          deposit_received_date?: string | null
          id?: string
          landlord_id: string
          move_out_date?: string | null
          notice_given?: boolean
          notice_given_date?: string | null
          started_at?: string
          tenant_id: string
          tenant_token?: string
          unit_id: string
        }
        Update: {
          created_at?: string
          deposit_amount?: number
          deposit_received_date?: string | null
          id?: string
          landlord_id?: string
          move_out_date?: string | null
          notice_given?: boolean
          notice_given_date?: string | null
          started_at?: string
          tenant_id?: string
          tenant_token?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_tenant_id_landlord_id_fkey"
            columns: ["tenant_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "tenant"
            referencedColumns: ["id", "landlord_id"]
          },
          {
            foreignKeyName: "tenancy_unit_id_landlord_id_fkey"
            columns: ["unit_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
      tenant: {
        Row: {
          created_at: string
          email: string | null
          id: string
          landlord_id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          landlord_id: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          landlord_id?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["id"]
          },
        ]
      }
      unit: {
        Row: {
          created_at: string
          default_deposit: number
          door_token: string
          id: string
          landlord_id: string
          monthly_rent: number
          property_id: string
          unit_number: string
          unit_type: string | null
        }
        Insert: {
          created_at?: string
          default_deposit: number
          door_token?: string
          id?: string
          landlord_id: string
          monthly_rent: number
          property_id: string
          unit_number: string
          unit_type?: string | null
        }
        Update: {
          created_at?: string
          default_deposit?: number
          door_token?: string
          id?: string
          landlord_id?: string
          monthly_rent?: number
          property_id?: string
          unit_number?: string
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unit_property_id_landlord_id_fkey"
            columns: ["property_id", "landlord_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id", "landlord_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      resolve_tenant_token: {
        Args: { p_token: string }
        Returns: Database["public"]["CompositeTypes"]["tenant_token_resolution"]
        SetofOptions: {
          from: "*"
          to: "tenant_token_resolution"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      tenant_token_resolution: {
        token_type: string | null
        unit_id: string | null
        tenancy_id: string | null
        prefill_name: string | null
        prefill_phone: string | null
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

