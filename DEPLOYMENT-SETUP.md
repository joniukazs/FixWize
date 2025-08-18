# 🔐 FIXWIZE GitHub Deployment Setup

## ✅ Jūs jau turite:
- GitHub Actions workflow failą (`.github/workflows/deploy.yml`)
- Kodą, kuris ready deployment'ui
- Mobile-responsive dizainą
- Parts supplier portal

## 🔧 Dabar reikia sukonfigūruoti GitHub Secrets:

### 1. Eikite į jūsų GitHub repository:
```
https://github.com/JŪSŲ_USERNAME/fixwize
```

### 2. Spauskite **Settings** tab (viršuje dešinėje)

### 3. Kairėje pusėje: **Secrets and variables** → **Actions**

### 4. Spauskite **"New repository secret"** kiekvienam secret

## 🔑 Pridėkite šiuos 5 secrets:

### Hostinger FTP duomenys:

**Secret 1:**
```
Name: FTP_HOST
Value: ftp.fixwize.com
```

**Secret 2:**
```
Name: FTP_USERNAME
Value: [jūsų Hostinger FTP username]
```

**Secret 3:**
```
Name: FTP_PASSWORD
Value: [jūsų Hostinger FTP password]
```

### Supabase duomenys:

**Secret 4:**
```
Name: VITE_SUPABASE_URL
Value: https://your-project-id.supabase.co
```

**Secret 5:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📋 Hostinger FTP duomenų gavimas:

### 1. Prisijunkite prie Hostinger hPanel
### 2. **File Manager** → **FTP Accounts** (viršuje)
### 3. Arba **Advanced** → **FTP Accounts**

### Sukurkite naują FTP account:
- **Username:** fixwize@fixwize.com (arba panašiai)
- **Password:** [sukurkite stiprų slaptažodį]
- **Directory:** /public_html
- **Quota:** Unlimited

### Nukopijuokite duomenis:
- **FTP Host:** ftp.fixwize.com (arba IP adresas)
- **Username:** fixwize@fixwize.com
- **Password:** [jūsų sukurtas]

## 🗄️ Supabase Setup:

### 1. Eikite į [supabase.com](https://supabase.com)
### 2. Sukurkite account ir naują projektą "FIXWIZE"
### 3. Palaukite kol projektas bus sukurtas (~2 min)

### 4. Paleiskite migracijas:
**SQL Editor** → **New query** → nukopijuokite ir paleiskite:
1. `supabase/migrations/20250619114508_broad_meadow.sql`
2. `supabase/migrations/20250619114555_super_brook.sql`

### 5. Gaukite API duomenis:
**Settings** → **API** → nukopijuokite:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 🚀 Deployment:

Po visų secrets pridėjimo:
```bash
git add .
git commit -m "Deploy FIXWIZE to production"
git push origin main
```

**GitHub Actions automatiškai deploy'ins į fixwize.com!**

## 📱 Kas bus automatiškai sukonfigūruota:

✅ **SSL sertifikatas**
✅ **SPA routing (.htaccess)**
✅ **Environment variables**
✅ **Security headers**
✅ **Static asset caching**
✅ **HTTPS redirect**
✅ **Mobile-responsive design**

## 🎯 Demo prisijungimo duomenys:

### Email/Password:
- **admin@fixwize.ie** / **demo123** (Admin)
- **mike@fixwize.ie** / **demo123** (Technician)
- **james@email.com** / **demo123** (Customer)
- **supplier@premiumautoparts.ie** / **demo123** (Parts Supplier)

### Phone Only (Demo mode):
- **+1234567890** (Admin)
- **+353 85 123 4567** (Customer)
- **+353155501234** (Parts Supplier)
- **+353155501235** (AutoParts Direct)

## 🔍 Stebėjimas:

### GitHub Actions:
- **Actions** tab → matysite deployment progress
- **Green checkmark** = sėkmingai deploy'inta
- **Red X** = klaida (patikrinkite logs)

### Testavimas:
1. **fixwize.com** atsidaro
2. **Prisijungimas veikia**
3. **Demo duomenys matomi**
4. **Mobile responsive**
5. **SSL aktyvus (https://)**

## 🆘 Troubleshooting:

### GitHub Actions klaidos:
- Patikrinkite ar visi 5 secrets pridėti
- Patikrinkite FTP duomenis (testuokite FileZilla)
- Patikrinkite Supabase connection

### Frontend klaidos:
- Browser console (F12)
- Network tab (API calls)
- Supabase logs

### Hostinger klaidos:
- hPanel → Error Logs
- File permissions
- .htaccess syntax

## 🎉 Po sėkmingo deployment:

Turėsite:
- ✅ **Automatinį deployment** (git push = live update)
- ✅ **Professional garage management system**
- ✅ **Customer portal**
- ✅ **Parts supplier portal**
- ✅ **Mobile-responsive design**
- ✅ **SSL security**
- ✅ **Demo duomenis testavimui**

---

**Sėkmės su FIXWIZE sistemos paleidimu! 🚀**