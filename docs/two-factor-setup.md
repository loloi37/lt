# Custom Two-Factor Setup

1. Run the SQL in [2026-04-08_custom_two_factor.sql](C:\Users\lkd_2\Desktop\lt\sql\2026-04-08_custom_two_factor.sql) inside Supabase SQL Editor.
2. Add a long random secret to `.env.local`:

```powershell
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::Create()
$bytes = New-Object byte[] 48
$rng.GetBytes($bytes)
$rng.Dispose()
$key = [Convert]::ToBase64String($bytes)
Add-Content .env.local "`nTWO_FACTOR_MASTER_KEY=$key"
```

3. Restart the app after updating `.env.local`.
