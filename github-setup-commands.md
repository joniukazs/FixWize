# GitHub Setup Commands - Lokalus Setup

## 🔧 Lokalus Git Setup (jei turite Git įdiegtą):

### 1. Pirmiausia sukurkite GitHub repository (be README)

### 2. Tada naudokite šias komandas terminale:

```bash
# Patikrinkite ar esate teisingame aplanke
pwd

# Patikrinkite ar Git jau inicializuotas
ls -la | grep .git

# Jei .git aplankas neegzistuoja, inicializuokite:
git init

# Pridėkite visus failus
git add .

# Sukurkite commit
git commit -m "FIXWIZE sistema - pradinė versija v1.0"

# Nustatykite main branch
git branch -M main

# Pridėkite remote (pakeiskite joniukazs į savo username)
git remote add origin https://github.com/joniukazs/fixwize.git

# Push'inkite kodą
git push -u origin main
```

### 3. Jei gaunate authentication klaidą:

```bash
# Nustatykite Git config
git config --global user.name "Jonas Kazlauskas"
git config --global user.email "joniukazs2x2@gmail.com"

# Bandykite push dar kartą
git push -u origin main
```

### 4. Jei vis dar klaidos:

```bash
# Patikrinkite remote
git remote -v

# Jei reikia, pakeiskite remote URL
git remote set-url origin https://github.com/joniukazs/fixwize.git

# Bandykite push su force
git push -u origin main --force
```

## 🌐 Alternatyvus metodas - GitHub Web Interface

### Jei Git komandos neveikia:

1. **Atsisiųskite visus projekto failus**
2. **Eikite į GitHub.com**
3. **Sukurkite naują repository**
4. **Spauskite "uploading an existing file"**
5. **Drag & drop visus failus**
6. **Commit changes**

## 🔐 GitHub Authentication:

Jei prašo slaptažodžio, naudokite **Personal Access Token** vietoj password:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: repo, workflow
4. Copy token ir naudokite kaip password

## ✅ Sėkmės požymiai:

Po sėkmingo upload'o turėtumėte:
- Matyti visus failus GitHub repository
- Matyti "Actions" tab
- Galėti konfigūruoti GitHub Secrets

## 🆘 Jei vis dar neveikia:

### GitHub CLI (jei galima):
```bash
# Įdiekite GitHub CLI (jei galima)
gh auth login
gh repo create fixwize --private
gh repo push
```

### Arba:
- Download'inkite ZIP iš WebContainer
- Upload'inkite per GitHub web interface
- Tai yra patikimiausias metodas!

## 📝 Svarbu

**WebContainer aplinkoje Git komandos nėra prieinamos.** Šis dokumentas skirtas lokaliam setup'ui jūsų kompiuteryje.

Rekomenduojame:
1. **Atsisiųsti projekto failus**
2. **Naudoti GitHub web interface**
3. **Arba setup'inti lokaliai su Git**