
/**
 * Supabase Database Types
 * 
 * This file contains TypeScript types for your Supabase database.
 * You can generate these types automatically using the Supabase CLI:
 * 
 * npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
 * 
 * For now, this file contains basic types. Update it with your actual database schema.
 */

export interface Database {
  public: {
    Tables: {
      // Add your table definitions here
      // Example:
      // users: {
      //   Row: {
      //     id: string;
      //     email: string;
      //     created_at: string;
      //   };
      //   Insert: {
      //     id?: string;
      //     email: string;
      //     created_at?: string;
      //   };
      //   Update: {
      //     id?: string;
      //     email?: string;
      //     created_at?: string;
      //   };
      // };
    };
    Views: {
      // Add your view definitions here
    };
    Functions: {
      // Add your function definitions here
    };
    Enums: {
      // Add your enum definitions here
    };
  };
}
