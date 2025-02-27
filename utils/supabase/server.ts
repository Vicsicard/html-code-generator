import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasEnvVars } from "./check-env-vars";

export const createClient = async () => {
  // Use placeholder values just to initialize the client
  // This won't connect to a real Supabase instance but prevents client-side errors
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key';
  
  try {
    const cookieStore = await cookies();

    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    );
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // Return a mock client that won't crash but won't do anything real
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        // Add other required methods with null returns
      }
    };
  }
};
