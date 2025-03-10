# HTML Code Creator - Development Environment Setup
# This script will install Node.js, set up the project, and configure environment variables

# Check if running as admin
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script must be run as an Administrator. Please restart PowerShell as Administrator and try again." -ForegroundColor Red
    exit
}

Write-Host "=== HTML Code Creator - Development Environment Setup ===" -ForegroundColor Cyan
Write-Host "This script will set up your local development environment." -ForegroundColor Cyan

# Step 1: Install Chocolatey if not already installed
Write-Host "`n[Step 1] Installing Chocolatey package manager..." -ForegroundColor Green
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Refresh environment
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Host "Chocolatey installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Chocolatey is already installed." -ForegroundColor Green
}

# Step 2: Install Node.js and NPM
Write-Host "`n[Step 2] Installing Node.js and NPM..." -ForegroundColor Green
choco install nodejs-lts -y
# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify Node.js installation
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = & node -v
    $npmVersion = & npm -v
    Write-Host "Node.js $nodeVersion and NPM $npmVersion installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Node.js installation couldn't be verified. Please restart your terminal after this script completes." -ForegroundColor Yellow
}

# Step 3: Set up environment variables
Write-Host "`n[Step 3] Setting up environment variables..." -ForegroundColor Green
$projectDir = "c:\Users\digit\CascadeProjects\HTML Code Creator"
Set-Location -Path $projectDir

# Check if .env.local exists, if not create it from .env.example
if (!(Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "Created .env.local from .env.example. Please update it with your API keys." -ForegroundColor Yellow
} else {
    Write-Host ".env.local already exists." -ForegroundColor Green
}

# Step 4: Install project dependencies
Write-Host "`n[Step 4] Installing project dependencies..." -ForegroundColor Green
Write-Host "This might take a few minutes..." -ForegroundColor Yellow
try {
    & npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install dependencies. Please try running 'npm install' manually after restarting your terminal." -ForegroundColor Red
}

# Step 5: Supabase setup information
Write-Host "`n[Step 5] Supabase Configuration" -ForegroundColor Green
Write-Host "The project requires Supabase configuration. Please:" -ForegroundColor Yellow
Write-Host "1. Create a Supabase project at https://app.supabase.com/" -ForegroundColor Yellow
Write-Host "2. Run the SQL script from 'supabase_setup.sql' in your Supabase SQL Editor" -ForegroundColor Yellow
Write-Host "3. Update your .env.local file with your Supabase credentials" -ForegroundColor Yellow

# Final instructions
Write-Host "`n=== Setup Complete! ===" -ForegroundColor Cyan
Write-Host "Before running the project, make sure to:" -ForegroundColor Yellow
Write-Host "1. Update your .env.local file with required API keys:" -ForegroundColor Yellow
Write-Host "   - Supabase credentials" -ForegroundColor Yellow
Write-Host "   - Stripe API keys (for subscription features)" -ForegroundColor Yellow
Write-Host "   - Cohere AI API key (for HTML generation)" -ForegroundColor Yellow
Write-Host "2. Run the Supabase setup SQL script if you're using a Supabase backend" -ForegroundColor Yellow
Write-Host "`nTo run the project:" -ForegroundColor Green
Write-Host "npm run dev     - Development mode" -ForegroundColor Cyan
Write-Host "npm run build   - Production build" -ForegroundColor Cyan
Write-Host "npm run start   - Run production build" -ForegroundColor Cyan
Write-Host "`nNote: You may need to restart your terminal for all changes to take effect." -ForegroundColor Yellow
