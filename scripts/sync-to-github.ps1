# Sync local changes to GitHub (commit + push).
# Usage: .\scripts\sync-to-github.ps1 [-Message "custom commit message"]

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$Git = @(
    "${env:ProgramFiles}\Git\bin\git.exe",
    "${env:LocalAppData}\Programs\Git\bin\git.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $Git) {
    Write-Error "Git non trovato. Installa Git for Windows o aggiungilo al PATH."
}

Push-Location $RepoRoot
try {
    & $Git fetch origin 2>$null

    $status = & $Git status --porcelain
    if ($status) {
        & $Git add -A
        if (-not $Message) {
            $Message = "chore: auto-sync $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        & $Git commit -m $Message
        Write-Host "Commit creato: $Message"
    } else {
        Write-Host "Nessuna modifica da committare."
    }

    $ahead = & $Git rev-list --count origin/main..HEAD 2>$null
    if ($ahead -and [int]$ahead -gt 0) {
        & $Git push origin main
        Write-Host "Push su origin/main completato."
    } else {
        $local = & $Git rev-parse HEAD
        $remote = & $Git rev-parse origin/main 2>$null
        if ($local -ne $remote) {
            & $Git push origin main
            Write-Host "Push su origin/main completato."
        } else {
            Write-Host "Repository gia allineata con GitHub."
        }
    }
} finally {
    Pop-Location
}
