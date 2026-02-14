#!/bin/bash

# Navigate to the project directory
cd /home/dhia/Bureau/patctice/project2

# Check if there are any changes
if [[ -n $(git status -s) ]]; then
    # Add all changes
    git add .
    
    # Commit with timestamp
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    git commit -m "Auto-commit: $TIMESTAMP"
    
    # Push to remote
    git push origin main 2>&1 || git push origin master 2>&1
    
    echo "[$TIMESTAMP] Changes committed and pushed successfully"
else
    echo "[$TIMESTAMP] No changes to commit"
fi
