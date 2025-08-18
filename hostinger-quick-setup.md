# FIXWIZE - Greitas Hostinger Setup

## Trumpi žingsniai:

### 1. Sukurkite build:
```bash
npm run build
```

### 2. Įkelkite į Hostinger:
- File Manager → public_html
- Įkelkite visą `dist/` turinį

### 3. Sukurkite .env failą public_html:
```
VITE_SUPABASE_URL=jūsų_supabase_url
VITE_SUPABASE_ANON_KEY=jūsų_supabase_key
```

### 4. Sukurkite .htaccess failą public_html:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 5. Supabase setup:
- Sukurkite projektą supabase.com
- SQL Editor → paleiskite migration failus
- Nukopijuokite URL ir anon key į .env

### 6. Testuokite:
- Atidarykite fixwize.com
- Prisijunkite: admin@fixwize.ie / demo123

## Pagalba:
Jei neveikia - patikrinkite browser console (F12) ir Hostinger error logs.