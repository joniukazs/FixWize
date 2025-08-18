# FIXWIZE Sistemos Atnaujinimo Instrukcijos

## Kaip atnaujinti sistemą serveryje

### 1. Automatinis būdas (rekomenduojamas)

Kai aš padarau pakeitimus sistemoje, galite naudoti šiuos žingsnius:

1. **Atsisiųskite naują kodą:**
   ```bash
   # Jei naudojate Git
   git pull origin main
   
   # Arba atsisiųskite ZIP failą iš GitHub/GitLab
   ```

2. **Atnaujinkite priklausomybes:**
   ```bash
   npm install
   ```

3. **Sukurkite produkcijai:**
   ```bash
   npm run build
   ```

4. **Įkelkite į serverį:**
   ```bash
   # Nukopijuokite 'dist' aplanką į jūsų serverio public_html
   ```

### 2. Hostinger specifiniai žingsniai

1. **Prisijunkite prie Hostinger File Manager**
2. **Eikite į public_html aplanką**
3. **Ištrinkite senus failus (išskyrus .env)**
4. **Įkelkite naują 'dist' aplanko turinį**
5. **Patikrinkite, ar .env failas vis dar yra su teisingais nustatymais**

### 3. Duomenų bazės atnaujinimai

Jei reikia atnaujinti duomenų bazę:

1. **Prisijunkite prie Supabase Dashboard**
2. **Eikite į SQL Editor**
3. **Paleiskite naują migracijos skriptą (jei yra)**

### 4. Aplinkos kintamieji (.env)

Patikrinkite, ar jūsų .env faile yra:
```
VITE_SUPABASE_URL=jūsų_supabase_url
VITE_SUPABASE_ANON_KEY=jūsų_supabase_anon_key
```

### 5. Automatizuotas atnaujinimas

Galite sukurti automatizuotą procesą:

1. **GitHub Actions** - automatiškai deploy'ina kai aš padarau pakeitimus
2. **Webhook** - Hostinger gauna pranešimą ir atnaujina
3. **FTP sync** - automatiškai sinchronizuoja failus

## Kas atsitiks po atnaujinimo?

✅ **Išliks:**
- Visi duomenys duomenų bazėje
- Vartotojų paskyros
- Nustatymai
- Klientų informacija

✅ **Atsinaujins:**
- Nauja funkcionalumas
- Pataisytos klaidos
- Pagerintas dizainas
- Naujos funkcijos

## Saugumo patarimai

1. **Visada darykite atsarginę kopiją** prieš atnaujinant
2. **Testuokite naują versiją** prieš diegiant produkcijai
3. **Saugokite .env failą** - niekada jo neperrašykite
4. **Patikrinkite duomenų bazės ryšį** po atnaujinimo

## Pagalba

Jei kyla problemų:
1. Patikrinkite browser console klaidas
2. Patikrinkite serverio error log'us
3. Patikrinkite duomenų bazės ryšį
4. Susisiekite su manimi su konkrečia klaida

## Versijų valdymas

Kiekvienas atnaujinimas turės:
- **Versijos numerį** (pvz., v1.2.3)
- **Pakeitimų sąrašą** (changelog)
- **Atnaujinimo instrukcijas**
- **Testavimo gaires**