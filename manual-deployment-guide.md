# 🛠️ Manual Deployment į Hostinger

## 1. Sukurkite production build:

```bash
npm run build
```

## 2. Sukurkite .env failą dist/ aplanke:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Sukurkite .htaccess failą dist/ aplanke:

```apache
RewriteEngine On
RewriteBase /

# Handle SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</filesMatch>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 4. Upload į Hostinger:

### File Manager būdas:
1. **Hostinger hPanel → File Manager**
2. **Eikite į public_html aplanką**
3. **Ištrinkite visus esamus failus**
4. **Upload'inkite visą dist/ aplanko turinį**

### FTP būdas (FileZilla):
```
Host: ftp.fixwize.com
Username: [iš Hostinger]
Password: [iš Hostinger]
Port: 21

Upload dist/ turinį į /public_html/
```

## 5. Testuokite:

- **Atidarykite fixwize.com**
- **Testuokite prisijungimą:** admin@fixwize.ie / demo123
- **Patikrinkite mobile responsive**

## 6. Troubleshooting:

### Jei puslapis neatsidaro:
- Patikrinkite ar .htaccess failas įkeltas
- Patikrinkite Hostinger error logs

### Jei duomenys neatsisiunčia:
- Patikrinkite .env failą
- Patikrinkite browser console (F12)
- Patikrinkite Supabase connection

### Jei prisijungimas neveikia:
- Patikrinkite Supabase migracijas
- Patikrinkite demo duomenis