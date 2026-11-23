# Run Crestia locally (no GoDaddy)

Local stack uses **Laragon** (PHP + MySQL) and WordPress at `C:\laragon\www\crestia`.  
The theme is linked from this repo: `wordpress/crestia-theme`.

## Site URL

http://127.0.0.1:8080/

| Page | URL |
|------|-----|
| Home | http://127.0.0.1:8080/ |
| RCM | http://127.0.0.1:8080/rcm/ |
| Healthcare | http://127.0.0.1:8080/healthcare/ |
| IT | http://127.0.0.1:8080/it/ |
| WP Admin | http://127.0.0.1:8080/wp-admin/ |

## Admin login

- **User:** `admin`
- **Password:** `CrestiaLocal123!`

## Start again after a reboot

1. Open **Laragon** and click **Start All** (or ensure MySQL is running).
2. In PowerShell:

```powershell
# MySQL (if not already running via Laragon)
# Then start the PHP server:
C:\laragon\bin\php\php-8.3.37-Win32-vs16-x64\php.exe -S 127.0.0.1:8080 router.php
```

Run that command from `C:\laragon\www\crestia`.

Or use this helper from the project:

```powershell
cd C:\Users\yrsch\OneDrive\Desktop\project1
.\wordpress\start-local.ps1
```

## Notes

- Theme changes in `project1\wordpress\crestia-theme` appear immediately (junction link).
- Do not upload to GoDaddy until you are ready; this setup is local-only.
