/* Types for the schema in supabase/migrations/20260917120000_admin_backend.sql.
   Written by hand in the shape `supabase gen types typescript` produces —
   regenerate with the CLI once the project is linked, and keep the
   exported aliases at the bottom. */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type InquiryStatus = "new" | "read" | "archived";
export type BookingStatus = "in_progress" | "pending" | "confirmed" | "declined" | "cancelled";
export type LeadSource = "inquiry" | "booking" | "manual";
export type Device = "mobile" | "tablet" | "desktop";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: InquiryStatus;
          page_path: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: InquiryStatus;
          page_path?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: InquiryStatus;
          page_path?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          session_id: string;
          status: BookingStatus;
          name: string | null;
          phone: string | null;
          email: string | null;
          event_type: string | null;
          event_date: string | null;
          guests: number | null;
          venue: string | null;
          cart: string | null;
          flavours: string[];
          custom_flavour: string | null;
          message: string | null;
          last_field: string | null;
          device: Device | null;
          source: string | null;
          landing_path: string | null;
          started_at: string;
          last_activity_at: string;
          submitted_at: string | null;
          confirmed_date: string | null;
          confirmed_time: string | null;
          admin_notes: string | null;
          confirmed_at: string | null;
          confirmed_by: string | null;
          status_changed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          status?: BookingStatus;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          venue?: string | null;
          cart?: string | null;
          flavours?: string[];
          custom_flavour?: string | null;
          message?: string | null;
          last_field?: string | null;
          device?: Device | null;
          source?: string | null;
          landing_path?: string | null;
          started_at?: string;
          last_activity_at?: string;
          submitted_at?: string | null;
          confirmed_date?: string | null;
          confirmed_time?: string | null;
          admin_notes?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          status_changed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          status?: BookingStatus;
          name?: string | null;
          phone?: string | null;
          email?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          venue?: string | null;
          cart?: string | null;
          flavours?: string[];
          custom_flavour?: string | null;
          message?: string | null;
          last_field?: string | null;
          device?: Device | null;
          source?: string | null;
          landing_path?: string | null;
          started_at?: string;
          last_activity_at?: string;
          submitted_at?: string | null;
          confirmed_date?: string | null;
          confirmed_time?: string | null;
          admin_notes?: string | null;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          status_changed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      booking_events: {
        Row: {
          id: number;
          session_id: string;
          type: "view" | "focus" | "complete" | "clear" | "error" | "submit";
          field: string | null;
          duration_ms: number | null;
          device: Device | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          session_id: string;
          type: "view" | "focus" | "complete" | "clear" | "error" | "submit";
          field?: string | null;
          duration_ms?: number | null;
          device?: Device | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          session_id?: string;
          type?: "view" | "focus" | "complete" | "clear" | "error" | "submit";
          field?: string | null;
          duration_ms?: number | null;
          device?: Device | null;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      crm_stages: {
        Row: {
          id: string;
          name: string;
          position: number;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      crm_leads: {
        Row: {
          id: string;
          stage_id: string;
          position: number;
          name: string;
          email: string | null;
          phone: string | null;
          event_type: string | null;
          event_date: string | null;
          guests: number | null;
          value_lkr: number | null;
          notes: string | null;
          source: LeadSource;
          inquiry_id: string | null;
          booking_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stage_id: string;
          position?: number;
          name: string;
          email?: string | null;
          phone?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          value_lkr?: number | null;
          notes?: string | null;
          source?: LeadSource;
          inquiry_id?: string | null;
          booking_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stage_id?: string;
          position?: number;
          name?: string;
          email?: string | null;
          phone?: string | null;
          event_type?: string | null;
          event_date?: string | null;
          guests?: number | null;
          value_lkr?: number | null;
          notes?: string | null;
          source?: LeadSource;
          inquiry_id?: string | null;
          booking_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      submit_inquiry: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone?: string | null;
          p_message?: string | null;
          p_page_path?: string | null;
          p_user_agent?: string | null;
        };
        Returns: string;
      };
      track_booking: {
        Args: {
          p_session_id: string;
          p_events?: Json;
          p_fields?: Json;
          p_context?: Json;
        };
        Returns: undefined;
      };
      submit_booking: {
        Args: {
          p_session_id: string;
          p_fields: Json;
          p_context?: Json;
        };
        Returns: string;
      };
      crm_move_lead: {
        Args: { p_lead_id: string; p_stage_id: string; p_index: number };
        Returns: undefined;
      };
      crm_reorder_stages: {
        Args: { p_stage_ids: string[] };
        Returns: undefined;
      };
      crm_delete_stage: {
        Args: { p_stage_id: string };
        Returns: undefined;
      };
      crm_lead_from_inquiry: {
        Args: { p_inquiry_id: string };
        Returns: string;
      };
      crm_lead_from_booking: {
        Args: { p_booking_id: string };
        Returns: string;
      };
      booking_form_analytics: {
        Args: { p_from: string; p_to: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicTables = Database["public"]["Tables"];

export type InquiryRow = PublicTables["inquiries"]["Row"];
export type BookingRow = PublicTables["bookings"]["Row"];
export type StageRow = PublicTables["crm_stages"]["Row"];
export type LeadRow = PublicTables["crm_leads"]["Row"];
