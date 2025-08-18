# GitHub Actions Automatinio Deployment Setup

## 🚀 Kaip sukonfigūruoti automatinį deployment

### 1. GitHub Repository Setup

#### Sukurkite GitHub repository per web interface:
1. **Eikite į GitHub.com**
2. **Spauskite "+" → "New repository"**
3. **Repository name:** `fixwize`
4. **Spauskite "Create repository"**

#### Įkelkite failus:
**Metodas 1: Web Interface (Rekomenduojamas)**
- Atsisiųskite projekto failus
- GitHub repository → "uploading an existing file"
- Drag & drop visus failus
- Commit changes

**Metodas 2: Lokalus Git (jei turite Git):**
```bash
# Tik jei turite Git įdiegtą lokaliai
git init
git add .
git commit -m "Initial FIXWIZE commit"
git branch -M main
git remote add origin https://github.com/JŪSŲ_USERNAME/fixwize.git
git push -u origin main
```

### 2. GitHub Secrets Konfigūracija

Eikite į jūsų GitHub repository → **Settings** → **Secrets and variables** → **Actions**

#### Pridėkite šiuos secrets:

**FTP Duomenys (iš Hostinger):**
- `FTP_HOST` = `ftp.fixwize.com` (arba IP adresas)
- `FTP_USERNAME` = jūsų Hostinger FTP username
- `FTP_PASSWORD` = jūsų Hostinger FTP password

**Supabase Duomenys:**
- `VITE_SUPABASE_URL` = jūsų Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = jūsų Supabase anon key

### 3. Hostinger FTP Duomenų Gavimas

#### Hostinger hPanel:
1. **File Manager** → **FTP Accounts**
2. Arba **Advanced** → **FTP Accounts**
3. Sukurkite naują FTP account arba naudokite esamą
4. Nukopijuokite:
   - **FTP Server:** (pvz., ftp.fixwize.com)
   - **Username:** (pvz., fixwize@fixwize.com)
   - **Password:** (jūsų nustatytas)

### 4. Supabase Duomenų Gavimas

#### Supabase Dashboard:
1. **Settings** → **API**
2. Nukopijuokite:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 5. Kaip veiks automatinis deployment

#### Kai atnaujinsite kodą GitHub:
**Per web interface:**
1. Atidarykite failą GitHub
2. Spauskite edit (pieštuko ikoną)
3. Padarykite pakeitimus
4. Commit changes

**Arba lokaliai (jei turite Git):**
```bash
git add .
git commit -m "Atnaujinau funkcionalumą"
git push origin main
```

#### GitHub Actions automatiškai:
1. ✅ Atsisiųs kodą
2. ✅ Įdiegs dependencies
3. ✅ Sukurs production build
4. ✅ Sukurs .env failą su jūsų Supabase duomenimis
5. ✅ Sukurs .htaccess failą
6. ✅ Įkels viską į Hostinger FTP
7. ✅ Jūsų svetainė bus atnaujinta!

### 6. Stebėjimas

#### GitHub Actions tab:
- Matysite visus deployment'us
- Galėsite sekti progress
- Matysite klaidas jei jos atsiras

#### Deployment statusas:
- 🟢 **Success** = svetainė atnaujinta
- 🔴 **Failed** = kažkas nepavyko
- 🟡 **Running** = vyksta deployment

### 7. Manual Deployment

Jei norite deploy'inti nedarydami pakeitimų:
1. GitHub repository → **Actions**
2. **Deploy FIXWIZE to Hostinger**
3. **Run workflow** → **Run workflow**

### 8. Troubleshooting

#### Jei deployment nepavyksta:

**FTP klaidos:**
- Patikrinkite FTP duomenis
- Patikrinkite ar Hostinger leidžia FTP ryšius

**Build klaidos:**
- Patikrinkite ar kodas kompiliuojasi lokaliai
- Patikrinkite dependencies

**Supabase klaidos:**
- Patikrinkite URL ir key
- Patikrinkite ar Supabase projektas aktyvus

### 9. Saugumo patarimai

✅ **Niekada necommit'inkite .env failų**
✅ **Naudokite GitHub Secrets**
✅ **Reguliariai keiskite FTP slaptažodžius**
✅ **Stebėkite deployment logs**

### 10. Ateities atnaujinimai

Kai bus padaromi pakeitimai sistemoje:
1. Atsisiųskite naują kodą
2. Įkelkite į GitHub (per web interface arba Git)
3. Automatiškai deploy'ins į jūsų svetainę!

**Per web interface:**
- Download ZIP su nauju kodu
- Upload į GitHub repository
- Automatiškai deploy'ins

**Arba lokaliai:**
```bash
git pull origin main  # Gauti naują kodą
git push origin main  # Automatiškai deploy'ins
```

## 🎉 Rezultatas

Po setup'o:
- ✅ Automatinis deployment į fixwize.com
- ✅ SSL sertifikatas
- ✅ Greitas loading
- ✅ SEO optimizacija
- ✅ Saugus .env valdymas

## 📝 Pastaba

**WebContainer aplinkoje Git komandos nėra prieinamos.** Šis guide pateikia alternatyvius metodus failų įkėlimui į GitHub.