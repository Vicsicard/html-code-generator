# Download and setup portable Node.js
$nodeVersion = "20.12.0"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"
$downloadPath = "$env:TEMP\node-portable.zip"
$extractPath = ".\node-portable"

Write-Host "Downloading portable Node.js v$nodeVersion..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $nodeUrl -OutFile $downloadPath

Write-Host "Extracting Node.js..." -ForegroundColor Cyan
Expand-Archive -Path $downloadPath -DestinationPath . -Force

# Rename the extracted folder
$extractedFolder = Get-ChildItem -Filter "node-v*-win-x64" | Select-Object -First 1
Rename-Item -Path $extractedFolder.Name -NewName "node-portable" -Force

Write-Host "Setting up project with portable Node.js..." -ForegroundColor Green
$nodePath = ".\node-portable\node.exe"
$npmPath = ".\node-portable\npm.cmd"

# Create a local script to run npm commands using the portable Node.js
@"
@echo off
set PATH=.\node-portable;%PATH%
.\node-portable\npm.cmd %*
"@ | Out-File -FilePath "run-npm.cmd" -Encoding ascii

Write-Host "Portable Node.js setup complete!" -ForegroundColor Green
Write-Host "You can now run npm commands using: .\run-npm.cmd [command]" -ForegroundColor Yellow
Write-Host "For example: .\run-npm.cmd install" -ForegroundColor Yellow
