# Kaip atnaujinti FIXWIZE sistemą

## Kai aš padarau pakeitimus:

### 1. Atsisiųskite naują kodą:
```bash
git pull origin main
# arba atsisiųskite ZIP failą
```

### 2. Atnaujinkite ir sukurkite:
```bash
npm install
npm run build
```

### 3. Įkelkite į serverį:
- Hostinger File Manager
- Ištrinkite senus failus (IŠSKYRUS .env)
- Įkelkite naują `dist/` turinį

### 4. Patikrinkite:
- Atidarykite fixwize.com
- Testuokite funkcionalumą

## Automatinis būdas (ateityje):
Galiu sukonfigūruoti GitHub Actions, kad automatiškai deploy'intų kai aš padarau pakeitimus.

## Svarbu:
- ✅ Duomenys išliks (Supabase)
- ✅ Nustatymai išliks
- ✅ .env failas nebus pakeistas
- ⚠️ Visada darykite backup prieš atnaujinant