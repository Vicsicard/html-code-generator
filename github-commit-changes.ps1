# Script to commit and push changes to GitHub without using Git
# Requires: GitHub Personal Access Token with repo permissions

# Configuration
$owner = "Vicsicard"
$repo = "html-code-generator"
$branch = "new-branch-3-8-25"

# Prompt for GitHub token
$token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Files to commit
$filesToCommit = @(
    "app/api/hardcoded-flowers/route.js",
    "components/ChatBox.js",
    "middleware.js",
    "app/flowers-page/page.js",
    "project-context-implementation.md"
)

# Commit message
$commitMessage = "Fix HTML generation issues and improve response handling

- Fix authentication flow to default to login mode rather than signup
- Disable trial expiration redirects from workspace to pricing page
- Add hardcoded flowers API endpoint for reliable responses
- Update ChatBox to detect flower-related requests and route appropriately
- Modify middleware to allow access to test and hardcoded API endpoints
- Add standalone test pages that bypass complex app components
- Create project context implementation plan for future enhancements"

Write-Host "Preparing to commit the following files to $branch branch:"
$filesToCommit | ForEach-Object { Write-Host " - $_" }

# For each file, get the current content from GitHub, then update it
foreach ($file in $filesToCommit) {
    $localFilePath = Join-Path -Path (Get-Location) -ChildPath $file
    
    if (Test-Path $localFilePath) {
        Write-Host "Processing $file..."
        
        # Read local file content
        $fileContent = Get-Content -Path $localFilePath -Raw
        $encodedContent = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($fileContent))
        
        # Get current file from GitHub to get the SHA
        try {
            $apiUrl = "https://api.github.com/repos/$owner/$repo/contents/$file?ref=$branch"
            $headers = @{
                Authorization = "token $plainToken"
                "User-Agent" = "PowerShell-Script"
            }
            
            # First check if the file exists
            try {
                $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get
                $currentSha = $response.sha
                Write-Host " - File exists on GitHub, will update"
            }
            catch {
                # File doesn't exist yet
                $currentSha = $null
                Write-Host " - File doesn't exist on GitHub yet, will create"
            }
            
            # Prepare the request body
            $body = @{
                message = $commitMessage
                branch = $branch
                content = $encodedContent
            }
            
            # Add SHA if file exists
            if ($currentSha) {
                $body.sha = $currentSha
            }
            
            # Convert to JSON
            $bodyJson = $body | ConvertTo-Json
            
            # Commit the file
            $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Put -Body $bodyJson
            Write-Host " - Successfully committed $file"
        }
        catch {
            Write-Host "Error committing $file : $_"
        }
    }
    else {
        Write-Host "Warning: $file does not exist locally and will be skipped"
    }
}

Write-Host "Commit process completed!"
