# FIXWIZE Deployment Guide - Hostinger

## 1. Paruošimas lokaliai

### Sukurkite produkcijai skirtą versiją:
```bash
npm run build
```

Tai sukurs `dist` aplanką su visais reikalingais failais.

## 2. Hostinger File Manager

1. **Prisijunkite prie Hostinger hPanel**
2. **Eikite į File Manager**
3. **Atidarykite public_html aplanką**
4. **Ištrinkite visus esamus failus** (jei yra)
5. **Įkelkite visą `dist` aplanko turinį** į public_html

### Failų struktūra turėtų atrodyti taip:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── vite.svg
└── logo-main.png
```

## 3. Duomenų bazės konfigūracija (Supabase)

### Sukurkite Supabase projektą:
1. Eikite į [supabase.com](https://supabase.com)
2. Sukurkite naują projektą
3. Palaukite kol projektas bus sukurtas

### Paleiskite migracijas:
1. Eikite į Supabase Dashboard → SQL Editor
2. Nukopijuokite ir paleiskite turinį iš `supabase/migrations/20250619114508_broad_meadow.sql`
3. Nukopijuokite ir paleiskite turinį iš `supabase/migrations/20250619114555_super_brook.sql`

## 4. Aplinkos kintamieji

### Sukurkite `.env` failą public_html aplanke:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Kaip gauti Supabase duomenis:**
1. Supabase Dashboard → Settings → API
2. Nukopijuokite "Project URL" ir "anon public" raktą

## 5. Hostinger specifiniai nustatymai

### .htaccess failas (sukurkite public_html aplanke):
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and Vue.js HTML5 mode
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
```

## 6. Testavimas

1. **Atidarykite fixwize.com**
2. **Patikrinkite ar veikia prisijungimas**
3. **Testuokite pagrindinį funkcionalumą**

### Demo prisijungimo duomenys:
- **Email:** admin@fixwize.ie
- **Password:** demo123

## 7. SSL sertifikatas

Hostinger automatiškai suteiks SSL sertifikatą. Jei ne:
1. hPanel → SSL → Manage SSL
2. Įjunkite "Force HTTPS"

## 8. Automatinis atnaujinimas (ateityje)

### GitHub Actions (rekomenduojama):
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_HOST }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

## 9. Troubleshooting

### Jei nepavyksta prisijungti:
1. Patikrinkite browser console klaidas (F12)
2. Patikrinkite ar .env failas teisingas
3. Patikrinkite Supabase ryšį

### Jei puslapis neatsidaro:
1. Patikrinkite ar .htaccess failas sukurtas
2. Patikrinkite ar visi failai įkelti
3. Patikrinkite Hostinger error logs

### Jei duomenys neatsisiunčia:
1. Patikrinkite Supabase URL ir raktą
2. Patikrinkite ar migracijos paleistos
3. Patikrinkite RLS policies

## 10. Saugumo patarimai

1. **Niekada neviešinkite .env failo**
2. **Reguliariai darykite atsargines kopijas**
3. **Naudokite stiprius slaptažodžius**
4. **Stebėkite Supabase usage**

## 11. Palaikymas

Jei kyla problemų:
1. Patikrinkite šį vadovą
2. Peržiūrėkite browser console
3. Patikrinkite Hostinger error logs
4. Susisiekite su palaikymu su konkrečia klaida