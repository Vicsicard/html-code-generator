# HTML Code Creator - Node.js Downloader
# This script will download Node.js installer without requiring admin rights

Write-Host "=== HTML Code Creator - Node.js Downloader ===" -ForegroundColor Cyan

# Define Node.js version to install
$nodeVersion = "20.12.0" # LTS version
$nodeInstallerUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$downloadDir = "$env:USERPROFILE\Downloads"
$installerPath = "$downloadDir\node-v$nodeVersion-x64.msi"

# Create download directory if it doesn't exist
if (!(Test-Path $downloadDir)) {
    New-Item -ItemType Directory -Path $downloadDir | Out-Null
}

# Download Node.js installer
Write-Host "Downloading Node.js v$nodeVersion to $installerPath..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $nodeInstallerUrl -OutFile $installerPath

Write-Host "`nNode.js installer downloaded successfully!" -ForegroundColor Green
Write-Host "Please run the installer manually by opening:" -ForegroundColor Yellow
Write-Host $installerPath -ForegroundColor Yellow
Write-Host "`nAfter installation, restart your terminal and run:" -ForegroundColor Yellow
Write-Host "cd 'c:\Users\digit\CascadeProjects\HTML Code Creator'" -ForegroundColor Cyan
Write-Host "npm install" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Cyan
