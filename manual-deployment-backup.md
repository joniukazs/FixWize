# Atsarginis Manual Deployment Būdas

Jei GitHub Actions neveiks, galite naudoti šį manual būdą:

## 1. Lokalus Build

```bash
# Sukurkite production build
npm run build

# Sukurkite .env failą dist aplanke
echo "VITE_SUPABASE_URL=jūsų_supabase_url" > dist/.env
echo "VITE_SUPABASE_ANON_KEY=jūsų_supabase_key" >> dist/.env
```

## 2. .htaccess failas

Sukurkite `dist/.htaccess`:
```apache
RewriteEngine On
RewriteBase /

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff

<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</filesMatch>
```

## 3. Upload į Hostinger

1. **Hostinger File Manager**
2. **public_html aplankas**
3. **Ištrinkite senus failus**
4. **Įkelkite visą dist/ turinį**

## 4. Patikrinimas

- Atidarykite fixwize.com
- Testuokite prisijungimą
- Patikrinkite funkcionalumą

## 5. FTP Upload (alternatyva)

```bash
# Naudojant FTP client (pvz., FileZilla)
Host: ftp.fixwize.com
Username: jūsų_ftp_username
Password: jūsų_ftp_password
Port: 21

# Upload dist/ turinį į /public_html/
```

Šis būdas visada veiks kaip atsarginis variantas!