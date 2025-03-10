import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasEnvVars } from "./check-env-vars";

export const createClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-key';
  
  try {
    const cookieStore = await cookies();

    const client = createServerClient(
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
      }
    );

    // If environment variables aren't set, return a client with limited functionality
    // but one that still has auth methods to prevent TypeScript errors
    if (!hasEnvVars) {
      return client;
    }

    return client;
  } catch (error) {
    // If we can't initialize the client properly, still return a client object
    // that has the expected shape but with limited functionality
    console.error('Error initializing Supabase client: ', error);
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() { return []; },
          setAll() { /* no-op */ },
        },
      }
    );
  }
};
