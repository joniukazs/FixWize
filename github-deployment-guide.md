# 🚀 FIXWIZE GitHub Deployment - Greitas Setup

## ✅ Jūs jau turite:
- GitHub Actions workflow failą (`.github/workflows/deploy.yml`)
- Kodą, kuris ready deployment'ui

## 🔧 Reikia sukonfigūruoti GitHub Secrets:

### 1. Eikite į jūsų GitHub repository:
```
https://github.com/JŪSŲ_USERNAME/fixwize
```

### 2. Settings → Secrets and variables → Actions

### 3. Pridėkite šiuos 5 secrets:

#### Hostinger FTP duomenys:
```
FTP_HOST = ftp.fixwize.com (arba IP adresas)
FTP_USERNAME = jūsų_hostinger_ftp_username  
FTP_PASSWORD = jūsų_hostinger_ftp_password
```

#### Supabase duomenys:
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Supabase Setup (jei dar neturite):

### 1. Eikite į [supabase.com](https://supabase.com)
### 2. Sukurkite projektą "FIXWIZE"  
### 3. SQL Editor → paleiskite migracijas:
   - `supabase/migrations/20250619114508_broad_meadow.sql`
   - `supabase/migrations/20250619114555_super_brook.sql`
### 4. Settings → API → nukopijuokite URL ir anon key

## 🚀 Deployment:

Po secrets konfigūracijos:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

**GitHub Actions automatiškai deploy'ins į fixwize.com!**

## 📱 Hostinger FTP duomenų gavimas:

### hPanel → File Manager → FTP Accounts:
- Sukurkite FTP account
- Nukopijuokite Host, Username, Password
- Pridėkite į GitHub Secrets

## ✅ Rezultatas:
- ✅ Automatinis deployment
- ✅ SSL sertifikatas  
- ✅ .htaccess konfigūracija
- ✅ Environment variables
- ✅ Optimizuotas build

## 🆘 Troubleshooting:
- GitHub Actions logs rodys deployment progress
- Browser console (F12) rodys frontend klaidas
- Hostinger error logs rodys server klaidas