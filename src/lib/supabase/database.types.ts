/* Types for the schema in supabase/migrations (admin backend, recent events,
   AI chat).
   Written by hand in the shape `supabase gen types typescript` produces —
   regenerate with the CLI once the project is linked, and keep the
   exported aliases at the bottom. */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type InquiryStatus = "new" | "read" | "archived";
export type BookingStatus = "in_progress" | "pending" | "confirmed" | "declined" | "cancelled";
export type LeadSource = "inquiry" | "booking" | "manual" | "chat";
export type ChatMode = "ai" | "human";
export type ChatRole = "user" | "assistant" | "agent" | "system";
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
          field_seq: number;
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
          field_seq?: number;
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
          field_seq?: number;
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
          chat_session_id: string | null;
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
          chat_session_id?: string | null;
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
          chat_session_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recent_events: {
        Row: {
          id: string;
          title: string;
          event_type: string | null;
          event_date: string | null;
          location: string | null;
          summary: string | null;
          photos: string[];
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          event_type?: string | null;
          event_date?: string | null;
          location?: string | null;
          summary?: string | null;
          photos?: string[];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          event_type?: string | null;
          event_date?: string | null;
          location?: string | null;
          summary?: string | null;
          photos?: string[];
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          mode: ChatMode;
          attention: boolean;
          handover_reason: string | null;
          visitor_name: string | null;
          visitor_email: string | null;
          visitor_phone: string | null;
          booking_draft: Json;
          first_page: string | null;
          last_page: string | null;
          device: Device | null;
          user_agent: string | null;
          message_count: number;
          visitor_message_count: number;
          last_preview: string | null;
          last_role: "user" | "assistant" | "agent" | null;
          last_message_at: string;
          last_visitor_message_at: string | null;
          visitor_seen_at: string;
          taken_over_at: string | null;
          taken_over_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          mode?: ChatMode;
          attention?: boolean;
          handover_reason?: string | null;
          visitor_name?: string | null;
          visitor_email?: string | null;
          visitor_phone?: string | null;
          booking_draft?: Json;
          first_page?: string | null;
          last_page?: string | null;
          device?: Device | null;
          user_agent?: string | null;
          message_count?: number;
          visitor_message_count?: number;
          last_message_at?: string;
          last_visitor_message_at?: string | null;
          visitor_seen_at?: string;
          taken_over_at?: string | null;
          taken_over_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          mode?: ChatMode;
          attention?: boolean;
          handover_reason?: string | null;
          visitor_name?: string | null;
          visitor_email?: string | null;
          visitor_phone?: string | null;
          booking_draft?: Json;
          last_page?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: number;
          session_id: string;
          role: ChatRole;
          content: string;
          blocks: Json;
          author_id: string | null;
          created_at: string;
        };
        Insert: {
          session_id: string;
          role: ChatRole;
          content?: string;
          blocks?: Json;
          author_id?: string | null;
          created_at?: string;
        };
        Update: {
          content?: string;
          blocks?: Json;
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
      crm_pipeline_summary: {
        Args: Record<PropertyKey, never>;
        Returns: { stage_id: string; leads: number; value_lkr: number }[];
      };
      admin_daily_activity: {
        Args: { p_from: string; p_days: number };
        Returns: { day: string; inquiries: number; requests: number }[];
      };
      published_events: {
        Args: { p_limit?: number };
        Returns: {
          id: string;
          title: string;
          event_type: string | null;
          event_date: string | null;
          location: string | null;
          summary: string | null;
          photos: string[];
        }[];
      };
      chat_append: {
        Args: { p_session_id: string; p_role: "user" | "assistant" | "system"; p_content: string; p_blocks?: Json; p_context?: Json };
        Returns: Json;
      };
      chat_feed: {
        Args: { p_session_id: string; p_after?: number; p_limit?: number };
        Returns: Json;
      };
      chat_update: {
        Args: { p_session_id: string; p_fields: Json };
        Returns: undefined;
      };
      chat_capture_lead: {
        Args: { p_session_id: string; p_fields: Json };
        Returns: string;
      };
      chat_admin_reply: {
        Args: { p_session_id: string; p_content: string };
        Returns: number;
      };
      chat_admin_set_mode: {
        Args: { p_session_id: string; p_mode: ChatMode };
        Returns: undefined;
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
export type RecentEventRow = PublicTables["recent_events"]["Row"];
export type ChatSessionRow = PublicTables["chat_sessions"]["Row"];
export type ChatMessageRow = PublicTables["chat_messages"]["Row"];
