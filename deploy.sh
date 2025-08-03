#!/bin/bash

# AWS Free Tier Deployment Script for Nebib Attendance System
# This script helps you deploy to AWS Amplify

echo "🚀 Nebib Attendance System - AWS Deployment"
echo "=============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI is not installed. You'll need to deploy manually via AWS Console."
    echo "📖 Follow the instructions in DEPLOYMENT.md"
else
    echo "✅ AWS CLI found"
fi

# Check if repository is connected to GitHub
if git remote -v | grep -q "github.com"; then
    echo "✅ GitHub repository detected"
    GITHUB_URL=$(git remote get-url origin)
    echo "📦 Repository: $GITHUB_URL"
else
    echo "❌ No GitHub remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    echo "   git push -u origin main"
    exit 1
fi

# Check project structure
echo ""
echo "📁 Checking project structure..."

if [ -f "package.json" ] && [ -d "app" ]; then
    echo "✅ Detected standard Next.js app structure"
    echo "📍 App directory: . (root level)"
elif [ -d "apps/web" ]; then
    echo "✅ Detected monorepo with apps/web structure"
    echo "📍 App directory: apps/web"
elif [ -d "packages/web" ]; then
    echo "✅ Detected monorepo with packages/web structure"
    echo "📍 App directory: packages/web"
else
    echo "❌ Could not detect project structure"
    echo "Please check MONOREPO_CONFIG.md for configuration options"
    exit 1
fi

# Check required files
echo ""
echo "📋 Checking required files..."

REQUIRED_FILES=("amplify.yml" "Dockerfile")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        MISSING_FILES+=("$file")
    fi
done

# Check app-specific files
if [ -f "package.json" ]; then
    echo "✅ package.json"
else
    echo "❌ package.json (missing)"
    MISSING_FILES+=("package.json")
fi

if [ -f "next.config.js" ]; then
    echo "✅ next.config.js"
else
    echo "❌ next.config.js (missing)"
    MISSING_FILES+=("next.config.js")
fi

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo ""
    echo "❌ Missing required files. Please ensure all files are present."
    exit 1
fi

# Check environment variables
echo ""
echo "🔐 Environment Variables Check"
echo "Make sure you have these variables ready for AWS Amplify:"
echo ""
echo "Required:"
echo "  - DATABASE_URL (your Railway PostgreSQL URL)"
echo "  - AUTH_SECRET (generate with: openssl rand -base64 32)"
echo ""
echo "Optional:"
echo "  - GOOGLE_CLIENT_ID"
echo "  - GOOGLE_CLIENT_SECRET"
echo "  - NEXTAUTH_URL (your app URL after deployment)"

# Generate auth secret if needed
echo ""
echo "🔑 Generate Auth Secret:"
echo "openssl rand -base64 32"

# Deployment instructions
echo ""
echo "🚀 Deployment Steps:"
echo "===================="
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: prepare for AWS deployment'"
echo "   git push"
echo ""
echo "2. Go to AWS Amplify Console:"
echo "   https://console.aws.amazon.com/amplify/"
echo ""
echo "3. Create new app → Host web app"
echo "4. Connect GitHub repository"
echo "5. Configure build settings (use amplify.yml)"
echo "6. Add environment variables"
echo "7. Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎉 Your app will be available at: https://your-app-id.amplifyapp.com"

# Check if user wants to proceed
echo ""
read -p "Do you want to commit and push your changes now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "feat: prepare for AWS deployment"
    echo "📤 Pushing to GitHub..."
    git push
    echo "✅ Code pushed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to AWS Amplify Console"
    echo "2. Create new app and connect your repository"
    echo "3. Add environment variables"
    echo "4. Deploy!"
else
    echo "📝 Remember to commit and push your changes before deploying."
fi

echo ""
echo "✨ Good luck with your deployment!" 