# Supabase Setup Instructions

This document provides step-by-step instructions for setting up your Supabase database correctly for the HTML Code Creator application.

## Database Setup

1. Go to your Supabase Dashboard
2. Select your project
3. Navigate to the SQL Editor (located in the left sidebar)
4. Create a "New Query"
5. Copy and paste the entire contents from `supabase_setup.sql`
6. Click "Run" to execute the SQL script

## Testing Setup

After running the script, verify that everything is set up correctly by:

1. Go to "Table Editor" in Supabase
2. Verify the following tables exist:
   - `user_metadata`
   - `user_credits`
   - `generation_history`

3. Go to "Authentication" → "Users"
4. Verify a user with email `test@example.com` exists

## Verifying Authentication

1. After the script runs successfully, go to your application:
   ```
   https://html-code-generator-git-master-vicsicards-projects.vercel.app/test-login
   ```

2. Use the following credentials:
   - Email: `test@example.com`
   - Password: `Test123456!`

3. If the login is successful, you should see a confirmation message with your user details

## Troubleshooting

If you encounter any issues:

1. **Check for SQL Errors**: If the script fails to run completely, fix any errors and run again.

2. **Check RLS Policies**: Go to "Table Editor" → Select a table → "Policies" tab and make sure the policies are properly set up.

3. **Verify Environment Variables**: Make sure your Vercel deployment has the correct Supabase URL and Anon Key set in environment variables.

4. **Check CORS Settings**: In Supabase "Project Settings" → "API", make sure your application URLs are added to the allowed origins.

5. **Test Each Authentication Method**: Use the `/auth-compare` page to test different authentication methods and isolate any issues.

## User Flow

Once authentication is working:

1. Login with test credentials
2. You should be redirected to the workspace
3. The app should automatically create the necessary user records in:
   - `user_metadata`
   - `user_credits`

4. When generating HTML, the app will:
   - Deduct credits from `user_credits`
   - Store the generation history in `generation_history`
