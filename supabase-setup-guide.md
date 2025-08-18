# Supabase Setup - Pilnas Vadovas

## 1. 🚀 Supabase Projekto Sukūrimas

### Eikite į Supabase:
1. **Atidarykite [supabase.com](https://supabase.com)**
2. **Spauskite "Start your project"**
3. **Prisijunkite su GitHub account**

### Sukurkite naują projektą:
1. **Spauskite "New Project"**
2. **Organization:** pasirinkite arba sukurkite
3. **Project name:** `FIXWIZE`
4. **Database password:** sukurkite stiprų slaptažodį (IŠSAUGOKITE!)
5. **Region:** `Europe (eu-west-1)` (artimiausias Lietuvai)
6. **Pricing plan:** `Free tier` (pradžiai)
7. **Spauskite "Create new project"**

### Palaukite setup'o:
- ⏳ Projektas kuriamas ~2 minutes
- ✅ Gausite žalią "Project ready" pranešimą

## 2. 🗄️ Duomenų Bazės Migracijos

### SQL Editor:
1. **Supabase Dashboard → SQL Editor**
2. **Spauskite "New query"**

### 1-oji migracija (Schema):
1. **Nukopijuokite visą turinį iš `supabase/migrations/20250619114508_broad_meadow.sql`**
2. **Įklijuokite į SQL Editor**
3. **Spauskite "Run" (arba Ctrl+Enter)**
4. **Turėtumėte matyti "Success" pranešimą**

### 2-oji migracija (Demo duomenys):
1. **Sukurkite naują query**
2. **Nukopijuokite visą turinį iš `supabase/migrations/20250619114555_super_brook.sql`**
3. **Įklijuokite ir paleiskite**
4. **Turėtumėte matyti "Success" pranešimą**

## 3. 🔑 API Duomenų Gavimas

### Settings → API:
1. **Supabase Dashboard → Settings → API**
2. **Nukopijuokite šiuos duomenis:**

```
Project URL: https://your-project-id.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Pridėkite į GitHub Secrets:
```
VITE_SUPABASE_URL = [Project URL]
VITE_SUPABASE_ANON_KEY = [anon public key]
```

## 4. 🔐 Row Level Security Patikrinimas

### Authentication → Policies:
1. **Eikite į Authentication → Policies**
2. **Turėtumėte matyti sukurtas policies visoms tables**
3. **Jei ne - paleiskite migracijas iš naujo**

### Table Editor:
1. **Eikite į Table Editor**
2. **Turėtumėte matyti šias tables:**
   - organizations
   - users  
   - customers
   - cars
   - work_orders
   - parts
   - invoices
   - activity_log

## 5. 🧪 Demo Duomenų Testavimas

### SQL Editor teste:
```sql
-- Patikrinkite ar demo duomenys įkelti
SELECT * FROM organizations;
SELECT * FROM users;
SELECT * FROM customers;
SELECT * FROM cars;
```

### Turėtumėte matyti:
- ✅ 2 organizations (FIXWIZE, Premium Auto Parts)
- ✅ 6 users (admin, technician, customers, etc.)
- ✅ 2 customers (James Murphy, Mary O'Connor)
- ✅ 2 cars (Toyota Corolla, VW Golf)

## 6. 🔧 Lokalus Testavimas

### Sukurkite .env.local failą:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Testuokite lokaliai:
```bash
npm run dev
```

### Prisijungimo testavimas:
- **Email:** admin@fixwize.ie
- **Password:** demo123

## 7. 📊 Monitoring ir Logs

### Dashboard Overview:
- **API Requests:** stebėkite usage
- **Database:** stebėkite storage
- **Auth:** stebėkite user activity

### Logs:
- **Logs → API Logs:** matysite visus API calls
- **Logs → Database Logs:** SQL queries
- **Logs → Auth Logs:** authentication events

## 8. 🔄 Backup ir Maintenance

### Automatic Backups:
- **Settings → Database → Backups**
- **Free tier:** 7 days retention
- **Galite download backup bet kada**

### Manual Backup:
```sql
-- Export specific tables
SELECT * FROM customers;
-- Copy results ir išsaugokite CSV
```

## 9. 🚨 Troubleshooting

### Jei migracijos nepavyko:
1. **SQL Editor → History**
2. **Peržiūrėkite error messages**
3. **Ištrinkite tables ir bandykite iš naujo:**
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Connection klaidos:
- Patikrinkite URL ir anon key
- Patikrinkite ar projektas "active"
- Patikrinkite network connection

### RLS klaidos:
- Patikrinkite ar policies sukurtos
- Patikrinkite auth.uid() functions

## 10. 📈 Production Readiness

### Security Checklist:
- ✅ RLS enabled visoms tables
- ✅ Policies sukurtos
- ✅ API keys saugūs
- ✅ Database password stiprus

### Performance:
- ✅ Indexes sukurti
- ✅ Connection pooling enabled
- ✅ Query optimization

## 🎉 Sėkmingo Setup Požymiai

Po setup'o turėtumėte galėti:
- ✅ Prisijungti prie FIXWIZE su demo duomenimis
- ✅ Matyti klientus, automobilius, darbo užsakymus
- ✅ Kurti naujus įrašus
- ✅ Generuoti sąskaitas
- ✅ Naudoti visą funkcionalumą

## 🔗 Naudingi Links

- **Supabase Docs:** https://supabase.com/docs
- **SQL Reference:** https://supabase.com/docs/guides/database
- **Auth Guide:** https://supabase.com/docs/guides/auth
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security