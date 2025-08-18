# GitHub Actions Deployment Setup

## 🎯 Dabar reikia sukonfigūruoti GitHub Secrets

### 1. Eikite į jūsų GitHub repository:
```
https://github.com/joniukazs/fixwize
```

### 2. Spauskite **Settings** tab (viršuje)

### 3. Kairėje pusėje: **Secrets and variables** → **Actions**

### 4. Spauskite **"New repository secret"**

## 🔐 Pridėkite šiuos secrets:

### Hostinger FTP duomenys:

**Secret 1:**
- Name: `FTP_HOST`
- Value: `ftp.fixwize.com` (arba IP adresas iš Hostinger)

**Secret 2:**
- Name: `FTP_USERNAME`
- Value: [jūsų Hostinger FTP username]

**Secret 3:**
- Name: `FTP_PASSWORD`
- Value: [jūsų Hostinger FTP password]

### Supabase duomenys (gausime vėliau):

**Secret 4:**
- Name: `VITE_SUPABASE_URL`
- Value: [Supabase project URL]

**Secret 5:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: [Supabase anon key]

## 📋 Hostinger FTP duomenų gavimas:

### 1. Prisijunkite prie Hostinger hPanel
### 2. Eikite į **File Manager**
### 3. Viršuje spauskite **"FTP Accounts"**
### 4. Arba **Advanced** → **FTP Accounts**

### Sukurkite naują FTP account:
- **Username:** fixwize@fixwize.com
- **Password:** [sukurkite stiprų]
- **Directory:** /public_html
- **Quota:** Unlimited

### Nukopijuokite duomenis:
- **FTP Host:** ftp.fixwize.com
- **Username:** fixwize@fixwize.com
- **Password:** [jūsų sukurtas]

## 🗄️ Supabase Setup:

### 1. Eikite į [supabase.com](https://supabase.com)
### 2. Sukurkite account ir naują projektą
### 3. Palaukite kol projektas bus sukurtas
### 4. Settings → API → nukopijuokite URL ir anon key

## ✅ Po setup'o:

Kai pridėsite visus secrets, galėsite:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

GitHub Actions automatiškai deploy'ins į fixwize.com!

## 🆘 Jei reikia pagalbos:

1. Screenshot'inkite Hostinger FTP settings
2. Screenshot'inkite Supabase API settings
3. Patikrinkite ar visi GitHub Secrets pridėti