#!/bin/bash
while true; do
    sleep 300  # Attendre 5 minutes
    git add .
    git commit -m "auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    echo "✅ Code sauvegardé sur GitHub!"
done
