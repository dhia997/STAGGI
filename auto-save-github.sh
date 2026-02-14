#!/bin/bash

# Configuration
REPO_DIR="/home/dhia/Bureau/patctice/project2"
GITHUB_TOKEN="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"
GITHUB_USER="dhia997"
GITHUB_REPO="STAGGI"

# Configurer Git pour utiliser le token
cd "$REPO_DIR"
git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git

echo "✅ Git configuré avec le token!"
echo "🔄 Auto-save activé - Sauvegarde toutes les 5 minutes..."
echo ""

# Boucle infinie pour auto-save
while true; do
    # Attendre 5 minutes (300 secondes)
    sleep 300
    
    # Aller dans le répertoire
    cd "$REPO_DIR"
    
    # Vérifier s'il y a des changements
    if [[ -n $(git status -s) ]]; then
        DATE=$(date '+%Y-%m-%d %H:%M:%S')
        echo "[$DATE] 💾 Changements détectés, sauvegarde en cours..."
        
        # Add, commit, push
        git add .
        git commit -m "auto-save: $DATE"
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "[$DATE] ✅ Code sauvegardé sur GitHub!"
        else
            echo "[$DATE] ❌ Erreur lors du push"
        fi
    else
        echo "[$(date '+%H:%M:%S')] ✓ Pas de changements"
    fi
    
    echo ""
done
