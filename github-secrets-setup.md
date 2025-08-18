# 🔐 GitHub Secrets Konfigūracija - FIXWIZE

## Jūsų FTP duomenys:
- **FTP Host:** 92.113.18.133
- **Username:** u393869376.fixwize.com
- **Password:** abcd1992efgh1336A*

## 📋 Žingsnis po žingsnio:

### 1. Eikite į GitHub repository:
```
https://github.com/joniukazs/fixwize
```

### 2. Spauskite **Settings** tab (viršuje dešinėje)

### 3. Kairėje pusėje: **Secrets and variables** → **Actions**

### 4. Spauskite **"New repository secret"** kiekvienam secret

## 🔑 Pridėkite šiuos 5 secrets:

### Secret 1 - FTP Host:
```
Name: FTP_HOST
Value: 92.113.18.133
```

### Secret 2 - FTP Username:
```
Name: FTP_USERNAME
Value: u393869376.fixwize.com
```

### Secret 3 - FTP Password:
```
Name: FTP_PASSWORD
Value: abcd1992efgh1336A*
```

### Secret 4 - Supabase URL (gausime vėliau):
```
Name: VITE_SUPABASE_URL
Value: [Supabase project URL]
```

### Secret 5 - Supabase Key (gausime vėliau):
```
Name: VITE_SUPABASE_ANON_KEY
Value: [Supabase anon key]
```

## ✅ Po FTP secrets pridėjimo:

Galėsite testuoti deployment su laikinais Supabase duomenimis:

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

## 🗄️ Kitas žingsnis - Supabase:

1. Eikite į [supabase.com](https://supabase.com)
2. Sukurkite account
3. Sukurkite naują projektą "FIXWIZE"
4. Gaukite URL ir anon key
5. Pridėkite juos į GitHub Secrets

## 🎯 Rezultatas:

Po visų secrets pridėjimo, kiekvienas `git push` automatiškai deploy'ins į fixwize.com!