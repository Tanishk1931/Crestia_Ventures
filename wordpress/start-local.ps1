# Start local Crestia WordPress
$ErrorActionPreference = 'Stop'
$php = 'C:\laragon\bin\php\php-8.3.37-Win32-vs16-x64\php.exe'
$mysql = 'C:\laragon\bin\mysql\mysql-8.4.3-winx64'
$wpRoot = 'C:\laragon\www\crestia'
$myIni = 'C:\laragon\tmp\my-crestia.ini'

if (-not (Test-Path $php)) { throw "PHP not found. Is Laragon installed at C:\laragon?" }
if (-not (Test-Path $wpRoot)) { throw "WordPress not found at $wpRoot" }

# Dedicated MySQL for Crestia (port 3307)
$port3307 = Get-NetTCPConnection -LocalPort 3307 -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $port3307) {
  if (-not (Test-Path $myIni)) {
    throw "MySQL config missing ($myIni). Ask the agent to recreate the local DB setup."
  }
  Start-Process -FilePath "$mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=$myIni" -WindowStyle Hidden
  Start-Sleep -Seconds 4
}

$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($port8080) {
  Write-Host "Already running at http://127.0.0.1:8080/"
  Start-Process 'http://127.0.0.1:8080/'
  exit 0
}

Write-Host 'Starting WordPress at http://127.0.0.1:8080/ ...'
Start-Process 'http://127.0.0.1:8080/'
Set-Location $wpRoot
& $php -S 127.0.0.1:8080 router.php
