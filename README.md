<h1 align="center">HTML Code Creator</h1>

<p align="center">
 AI-powered HTML, CSS, and JavaScript generation with live preview
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#technologies-used"><strong>Technologies Used</strong></a> ·
  <a href="#setup-and-installation"><strong>Setup and Installation</strong></a> ·
  <a href="#environment-variables"><strong>Environment Variables</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>
<br/>

## Features

- **AI-Powered HTML Generation**: Describe what you want in natural language, and get fully functional HTML, CSS, and JavaScript code.
- **Live Preview**: Instantly see how your code looks with real-time preview.
- **Code Editor**: Edit the generated code directly in the browser.
- **User Authentication**: Sign up and log in with email/password or Google account.
- **Subscription Management**: Choose between a free 1-hour trial or a paid subscription ($19.99/month).

## Technologies Used

- **Frontend**: Next.js with App Router, React, Tailwind CSS
- **Authentication**: Supabase Authentication
- **Database**: Supabase Database
- **Payment Processing**: Stripe
- **AI Integration**: Cohere AI
- **Code Editor**: React CodeMirror
- **Form Validation**: React Hook Form

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone [your-repository-url]
   cd html-ai-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env.local` and update the values:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values for:
   - Supabase URL and anonymous key
   - Stripe API keys and webhook secret
   - Cohere AI API key
   - Site URL for redirects

4. **Set up Supabase**

   - Create a new project at [database.new](https://database.new)
   - Set up authentication providers (Email and Google)
   - Create the necessary tables:
     - `user_metadata`: For storing user subscription information
     - `ai_usage`: For tracking AI usage (optional)

5. **Set up Stripe**

   - Create a Stripe account and set up a subscription product with a $19.99/month price
   - Configure webhooks to point to your `/api/webhooks` endpoint
   - Add the Stripe price ID and webhook secret to your environment variables

6. **Set up Cohere AI**

   - Create an account on [Cohere](https://cohere.com/)
   - Get an API key and add it to your environment variables

7. **Run the development server**

   ```bash
   npm run dev
   ```

   The application should now be running on [localhost:3000](http://localhost:3000/).

## Environment Variables

The following environment variables are required for the application to function properly:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PRICE_ID=your-stripe-price-id-for-subscription
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Cohere AI
COHERE_API_KEY=your-cohere-api-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

This project can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add all the required environment variables in the Vercel project settings
4. Deploy the project

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external)

## Usage

1. **Sign Up**: Create a new account using email/password or Google authentication.
2. **Generate HTML**: In the workspace, describe what you want to create in the chat window.
3. **Preview and Edit**: View the generated HTML in the preview window and edit it in the code editor.
4. **Copy Code**: Copy the generated code to use in your own projects.
5. **Subscribe**: Upgrade to the Pro plan for unlimited access.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Cohere AI Documentation](https://docs.cohere.com/)
