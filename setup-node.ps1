# Setup Node.js for HTML Code Creator
Write-Host "Setting up Node.js for HTML Code Creator..." -ForegroundColor Green

# Define Node.js version to install
$nodeVersion = "20.12.0" # LTS version
$nodeInstallerUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\node-installer.msi"

# Download Node.js installer
Write-Host "Downloading Node.js v$nodeVersion..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $nodeInstallerUrl -OutFile $installerPath

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Cyan
Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait

# Refresh environment variables without restarting PowerShell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installation
Write-Host "Verifying Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "Node.js installed successfully!" -ForegroundColor Green
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "NPM version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "Failed to verify Node.js installation. You may need to restart your computer." -ForegroundColor Red
    exit 1
}

# Change to project directory
Set-Location -Path "c:\Users\digit\CascadeProjects\HTML Code Creator"

# Check for environment variables
if (!(Test-Path -Path ".env.local")) {
    Write-Host "Copying .env.example to .env.local..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env.local"
}

# Install project dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Setup complete! You can now run the project with:" -ForegroundColor Green
Write-Host "npm run dev - For development" -ForegroundColor Yellow
Write-Host "npm run build - To build for production" -ForegroundColor Yellow
Write-Host "npm run start - To start the production build" -ForegroundColor Yellow
