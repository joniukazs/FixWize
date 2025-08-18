# 🚀 FIXWIZE Live Deployment Guide

## Jūsų sistema paruošta deployment'ui!

### Kas jau padaryta:
✅ **GitHub Actions workflow sukonfigūruotas**
✅ **Production build optimizuotas**
✅ **SSL ir security headers**
✅ **Automatic .env konfigūracija**
✅ **Mobile-responsive dizainas**

## 📋 Dabar reikia:

### 1. Įkelti kodą į GitHub
**Per web interface (rekomenduojama):**
1. Atsisiųskite visus projekto failus
2. Eikite į GitHub.com → sukurkite repository "fixwize"
3. Upload visus failus per "uploading an existing file"

### 2. Sukonfigūruoti GitHub Secrets
**Repository → Settings → Secrets and variables → Actions**

Pridėkite šiuos 5 secrets:
```
FTP_HOST = ftp.fixwize.com
FTP_USERNAME = [iš Hostinger]
FTP_PASSWORD = [iš Hostinger]
VITE_SUPABASE_URL = [iš Supabase]
VITE_SUPABASE_ANON_KEY = [iš Supabase]
```

### 3. Hostinger FTP Setup
**hPanel → FTP Accounts:**
- Sukurkite FTP account
- Nukopijuokite duomenis į GitHub Secrets

### 4. Supabase Setup
**supabase.com:**
- Sukurkite projektą "FIXWIZE"
- Paleiskite migracijas (SQL Editor)
- Nukopijuokite API duomenis

### 5. Automatinis Deployment
Po setup'o kiekvienas GitHub commit automatiškai:
- ✅ Sukurs production build
- ✅ Sukonfigūruos .env
- ✅ Įkels į Hostinger
- ✅ Atnaujins fixwize.com

## 🎯 Rezultatas:
- **fixwize.com** - veikianti sistema
- **SSL sertifikatas**
- **Mobile responsive**
- **Demo duomenys**
- **Automatiniai atnaujinimai**

## 📞 Demo prisijungimo duomenys:
- **admin@fixwize.ie** / **demo123**
- **+353 85 123 4567** (Customer portal)
- **+353155501234** (Parts supplier)

---

**Sekite detailed setup guide failus šiame projekte! 🚀**