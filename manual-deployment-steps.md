# Manual Deployment į Hostinger

## 1. Sukurkite build lokaliai:

```bash
npm run build
```

## 2. Sukurkite .env failą dist aplanke:

```env
VITE_SUPABASE_URL=jūsų_supabase_url
VITE_SUPABASE_ANON_KEY=jūsų_supabase_key
```

## 3. Sukurkite .htaccess failą dist aplanke:

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

# Cache static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</filesMatch>

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 4. Upload į Hostinger:

1. **Hostinger File Manager**
2. **Eikite į public_html aplanką**
3. **Ištrinkite visus esamus failus**
4. **Upload'inkite visą dist/ aplanko turinį**

## 5. Testuokite:

- Atidarykite fixwize.com
- Testuokite prisijungimą: admin@fixwize.ie / demo123

## 6. Jei neveikia:

- Patikrinkite browser console (F12)
- Patikrinkite ar .env failas teisingas
- Patikrinkite ar .htaccess failas įkeltas