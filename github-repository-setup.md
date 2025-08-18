# GitHub Repository Setup - Žingsnis po žingsnio

## 1. 🌐 GitHub Repository Sukūrimas

### Eikite į GitHub.com:
1. **Prisijunkite prie GitHub**
2. **Spauskite "+" viršuje dešinėje → "New repository"**
3. **Repository name:** `fixwize`
4. **Description:** `FIXWIZE - Professional Garage Management System`
5. **Public/Private:** Pasirinkite pagal poreikį
6. **❌ NEPAŽYMĖKITE:** "Add a README file"
7. **❌ NEPAŽYMĖKITE:** ".gitignore" ir "license"
8. **Spauskite "Create repository"**

## 2. 📁 Failų Įkėlimas į GitHub

### Metodas 1: Web Interface (Rekomenduojamas)
1. **Atsisiųskite visus projekto failus kaip ZIP**
2. **GitHub repository puslapyje spauskite "uploading an existing file"**
3. **Drag & drop visus failus arba pasirinkite per "choose your files"**
4. **Commit message:** `FIXWIZE sistema - pradinė versija v1.0`
5. **Spauskite "Commit changes"**

### Metodas 2: Lokalus Git Setup (jei turite Git)
```bash
# Eikite į jūsų projekto aplanką
cd /path/to/fixwize-project

# Inicializuokite Git
git init

# Pridėkite visus failus
git add .

# Sukurkite pirmą commit
git commit -m "FIXWIZE sistema - pradinė versija v1.0"

# Nustatykite main branch
git branch -M main

# Pridėkite GitHub remote
git remote add origin https://github.com/JŪSŲ_USERNAME/fixwize.git

# Push'inkite kodą
git push -u origin main
```

## 3. 🔐 GitHub Secrets Konfigūracija

### Eikite į jūsų repository:
1. **Settings** tab (viršuje)
2. **Secrets and variables** → **Actions** (kairėje)
3. **Spauskite "New repository secret"**

### Pridėkite šiuos secrets:

#### FTP Duomenys (gausime iš Hostinger):
```
Secret name: FTP_HOST
Value: ftp.fixwize.com
```

```
Secret name: FTP_USERNAME  
Value: [jūsų Hostinger FTP username]
```

```
Secret name: FTP_PASSWORD
Value: [jūsų Hostinger FTP password]
```

#### Supabase Duomenys (gausime vėliau):
```
Secret name: VITE_SUPABASE_URL
Value: [jūsų Supabase project URL]
```

```
Secret name: VITE_SUPABASE_ANON_KEY
Value: [jūsų Supabase anon key]
```

## 4. 📁 Hostinger FTP Duomenų Gavimas

### Hostinger hPanel:
1. **Prisijunkite prie Hostinger**
2. **hPanel → Advanced → FTP Accounts**
3. **Arba File Manager → FTP Accounts**

### Sukurkite FTP account:
- **Username:** `fixwize@fixwize.com` (arba panašiai)
- **Password:** sukurkite stiprų slaptažodį
- **Directory:** `/public_html`
- **Quota:** Unlimited

### Nukopijuokite duomenis:
- **FTP Host:** `ftp.fixwize.com`
- **Username:** `fixwize@fixwize.com`
- **Password:** [jūsų sukurtas]

## 5. ✅ Testavimas

### Patikrinkite GitHub:
- Ar failai atsirado GitHub repository?
- Ar GitHub Actions tab matomas?
- Ar .github/workflows/deploy.yml failas yra?

## 6. 🚀 Pirmasis Deployment

Po Supabase setup'o galėsite:
1. **Padaryti mažą pakeitimą faile**
2. **Įkelti pakeitimą per GitHub web interface**
3. **GitHub Actions automatiškai deploy'ins į fixwize.com!**

## 🆘 Troubleshooting

### Jei naudojate lokalų Git:

#### Git klaidos:
```bash
# Jei klaida su remote
git remote -v  # patikrinkite remote URL
git remote set-url origin https://github.com/USERNAME/fixwize.git
```

#### GitHub authentication:
- Naudokite Personal Access Token vietoj password
- GitHub Settings → Developer settings → Personal access tokens

### FTP duomenų testavimas:
- Naudokite FileZilla ar kitą FTP client
- Testuokite connection prieš pridedant į GitHub Secrets

## 📝 Pastaba

**WebContainer aplinkoje Git komandos nėra prieinamos.** Rekomenduojame naudoti GitHub web interface failų įkėlimui arba lokalų Git setup jūsų kompiuteryje.