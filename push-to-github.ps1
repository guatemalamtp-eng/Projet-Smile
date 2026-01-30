# Script PowerShell pour pousser le code vers GitHub automatiquement

Write-Host "Demarrage du push vers GitHub..." -ForegroundColor Green

# Aller dans le bon dossier
Set-Location "C:\Users\Rumpl\Cursor"

Write-Host "Dossier actuel: $(Get-Location)" -ForegroundColor Cyan

# Vérifier l'état Git
Write-Host "`nVerification de l'etat Git..." -ForegroundColor Yellow
git status

# Vérifier les commits en attente
$commitsAhead = git rev-list --count origin/main..HEAD 2>$null
if ($commitsAhead -gt 0) {
    Write-Host "`n$commitsAhead commit(s) a pousser" -ForegroundColor Green
    
    # Essayer de pousser
    Write-Host "`nTentative de push vers GitHub..." -ForegroundColor Yellow
    
    # Méthode 1 : Push direct
    Write-Host "`nMethode 1 : Push direct..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Push reussi !" -ForegroundColor Green
        Write-Host "`nLe code est maintenant sur GitHub !" -ForegroundColor Green
        Write-Host "Vercel va automatiquement deployer les changements." -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "Push echoue avec le token actuel" -ForegroundColor Red
        
        # Méthode 2 : Réessayer avec nouveau remote
        Write-Host "`nMethode 2 : Configuration d'un nouveau remote..." -ForegroundColor Cyan
        
        git remote remove origin
        git remote add origin https://github.com/guatemalamtp-eng/Projet-Smile.git
        
        Write-Host "`nNouvelle tentative de push..." -ForegroundColor Yellow
        Write-Host "GitHub va demander tes identifiants..." -ForegroundColor Yellow
        
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Push reussi !" -ForegroundColor Green
            Write-Host "`nLe code est maintenant sur GitHub !" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "Push echoue" -ForegroundColor Red
            Write-Host "`nSolution alternative :" -ForegroundColor Yellow
            Write-Host "1. Va sur https://github.com/guatemalamtp-eng/Projet-Smile" -ForegroundColor Cyan
            Write-Host "2. Clique sur 'Upload files'" -ForegroundColor Cyan
            Write-Host "3. Glisse-depose les fichiers depuis C:\Users\Rumpl\Cursor" -ForegroundColor Cyan
            exit 1
        }
    }
} else {
    Write-Host "`nAucun commit a pousser - tout est a jour !" -ForegroundColor Green
}
