$ErrorActionPreference = 'SilentlyContinue'

$statePath = Join-Path $env:USERPROFILE '.codex\.codex-global-state.json'
$backupPath = Join-Path $env:USERPROFILE '.codex\.codex-global-state.json.before-disable-remote-prompts'

if (Test-Path -LiteralPath $statePath) {
    Copy-Item -LiteralPath $statePath -Destination $backupPath -Force
}

$deadline = (Get-Date).AddMinutes(10)
while ((Get-Date) -lt $deadline) {
    try {
        if (Test-Path -LiteralPath $statePath) {
            $json = Get-Content -LiteralPath $statePath -Raw | ConvertFrom-Json
            $atoms = $json.'electron-persisted-atom-state'

            if ($null -ne $atoms) {
                $atoms.codexCloudAccess = 'disabled'
                $atoms.'electron:onboarding-hide-first-new-thread-promos' = $true
                $atoms.'electron:onboarding-plugin-checklist-active' = $false
            }

            $json | ConvertTo-Json -Depth 100 -Compress | Set-Content -LiteralPath $statePath -Encoding UTF8
        }
    } catch {
        Start-Sleep -Milliseconds 500
    }

    Start-Sleep -Seconds 2
}
