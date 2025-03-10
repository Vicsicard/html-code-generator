# HTML Code Creator - Setup Instructions

## Step 1: Install Node.js
1. Download Node.js LTS version from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Make sure to select the option to add Node.js to your PATH
4. Complete the installation
5. **Restart your computer** to ensure environment variables are properly set

## Step 2: Verify Installation
After restarting, open PowerShell or Command Prompt and run:
```
node -v
npm -v
```
You should see version numbers for both commands.

## Step 3: Set Up Project Dependencies
1. Navigate to the project directory:
```
cd c:\Users\digit\CascadeProjects\HTML Code Creator
```

2. Install project dependencies:
```
npm install
```

3. Make sure environment variables are set up:
```
# If .env.local doesn't exist, copy from example
if (!(Test-Path .env.local)) {
    Copy-Item .env.example .env.local
}
```

## Step 4: Run the Project
- For development: `npm run dev`
- To build for production: `npm run build`
- To start the production build: `npm run start`

## Troubleshooting
- If npm commands aren't recognized after installation, restart your terminal or computer
- Check that Node.js is properly added to your PATH
- Ensure you're in the correct project directory when running npm commands
