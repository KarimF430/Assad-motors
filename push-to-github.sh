#!/bin/bash

echo "🚀 GitHub Push Helper Script"
echo "=============================="
echo ""

# Check if authenticated
if ! gh auth status &>/dev/null; then
    echo "🔐 You need to authenticate with GitHub first"
    echo ""
    echo "Run this command:"
    echo "  gh auth login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ GitHub authentication verified"
echo ""

# Show current repository
echo "📍 Current repository:"
git remote -v
echo ""

# Show commit to be pushed
echo "📝 Latest commit:"
git log -1 --oneline
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 View your repository at:"
    echo "   https://github.com/KarimF430/Karims-mega-project"
else
    echo ""
    echo "❌ Push failed. Please check the error above."
    exit 1
fi
