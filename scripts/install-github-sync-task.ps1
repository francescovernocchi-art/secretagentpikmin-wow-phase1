# Registra un'attività pianificata Windows che sincronizza il repo ogni 5 minuti.
# Esegui una volta come amministratore: .\scripts\install-github-sync-task.ps1

$ErrorActionPreference = "Stop"
$TaskName = "SecretAgentPikmin-GitHubSync"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$SyncScript = Join-Path $RepoRoot "scripts\sync-to-github.ps1"

if (-not (Test-Path $SyncScript)) {
    Write-Error "Script non trovato: $SyncScript"
}

$Action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$SyncScript`""

$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
    -RepetitionInterval (New-TimeSpan -Minutes 5) `
    -RepetitionDuration ([TimeSpan]::MaxValue)

$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Force | Out-Null

Write-Host "Attivita '$TaskName' registrata: sync ogni 5 minuti verso GitHub."
Write-Host "Per rimuoverla: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
