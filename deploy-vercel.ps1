# PropScan Vercel Deployment - Quick Start

Write-Host "🚀 PropScan Vercel Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed!" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI is already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Before deploying, make sure you have:" -ForegroundColor Yellow
Write-Host "   1. Vercel account (sign up at vercel.com)" -ForegroundColor White
Write-Host "   2. GitHub repository pushed" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Continue with deployment? (Y/N)"

if ($continue -ne 'Y' -and $continue -ne 'y') {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Yellow
vercel login

Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "   Follow the prompts:" -ForegroundColor White
Write-Host "   - Set up and deploy? → Y" -ForegroundColor Gray
Write-Host "   - Which scope? → Select your account" -ForegroundColor Gray
Write-Host "   - Link to existing project? → N" -ForegroundColor Gray
Write-Host "   - Project name? → propscan-backend" -ForegroundColor Gray
Write-Host "   - Directory? → . (current)" -ForegroundColor Gray
Write-Host "   - Override settings? → N" -ForegroundColor Gray
Write-Host ""

vercel --prod

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Copy the Vercel URL from above" -ForegroundColor White
Write-Host "   2. Create src/.env file with:" -ForegroundColor White
Write-Host "      VITE_API_URL=https://your-vercel-url.vercel.app/api" -ForegroundColor Gray
Write-Host "   3. Test health endpoint:" -ForegroundColor White
Write-Host "      https://your-vercel-url.vercel.app/api/health" -ForegroundColor Gray
Write-Host "   4. Rebuild frontend: cd src && npm run build" -ForegroundColor White
Write-Host "   5. Deploy to GitHub Pages" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full guide: See VERCEL_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

$openDocs = Read-Host "Open deployment guide? (Y/N)"
if ($openDocs -eq 'Y' -or $openDocs -eq 'y') {
    Start-Process "VERCEL_DEPLOYMENT.md"
}

Write-Host ""
Write-Host "🎉 All done! Your backend is live on Vercel!" -ForegroundColor Green
