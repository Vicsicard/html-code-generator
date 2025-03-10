# Copy .env.example to .env.local
Copy-Item -Path .\.env.example -Destination .\.env.local
Write-Host "Created .env.local from .env.example"
Write-Host "Please edit .env.local with your actual API keys and configuration values."
