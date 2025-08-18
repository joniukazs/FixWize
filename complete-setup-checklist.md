# FIXWIZE - Pilnas Setup Checklist

## 📋 Prieš pradedant

- [ ] Node.js įdiegtas (v18+)
- [ ] GitHub account sukurtas
- [ ] Hostinger account aktyvus
- [ ] fixwize.com domain aktyvus

## 🔧 1. GitHub Repository Setup

- [ ] Projekto failai paruošti
- [ ] GitHub repository sukurtas per web interface
- [ ] Failai įkelti į GitHub (per web interface arba lokaliai)
- [ ] Repository matomas GitHub.com

## 🔐 2. GitHub Secrets Konfigūracija

- [ ] `FTP_HOST` = ftp.fixwize.com
- [ ] `FTP_USERNAME` = [iš Hostinger]
- [ ] `FTP_PASSWORD` = [iš Hostinger]
- [ ] `VITE_SUPABASE_URL` = [iš Supabase]
- [ ] `VITE_SUPABASE_ANON_KEY` = [iš Supabase]

## 🌐 3. Hostinger FTP Setup

- [ ] hPanel → FTP Accounts
- [ ] Naujas FTP account sukurtas
- [ ] FTP duomenys nukopijuoti
- [ ] FTP connection testuotas (FileZilla)

## 🗄️ 4. Supabase Projekto Setup

- [ ] Supabase account sukurtas
- [ ] Naujas projektas sukurtas
- [ ] Database password išsaugotas
- [ ] Projektas "ready" statusas

## 📊 5. Duomenų Bazės Migracijos

- [ ] SQL Editor atidarytas
- [ ] 1-oji migracija paleista (schema)
- [ ] 2-oji migracija paleista (demo data)
- [ ] Tables matomi Table Editor
- [ ] Demo duomenys įkelti

## 🔑 6. API Duomenų Gavimas

- [ ] Settings → API atidarytas
- [ ] Project URL nukopijuotas
- [ ] anon public key nukopijuotas
- [ ] Duomenys pridėti į GitHub Secrets

## 🧪 7. Lokalus Testavimas

- [ ] `.env.local` failas sukurtas
- [ ] `npm run dev` veikia
- [ ] Prisijungimas veikia (admin@fixwize.ie)
- [ ] Demo duomenys matomi
- [ ] Funkcionalumas testuotas

## 🚀 8. Pirmasis Deployment

- [ ] GitHub Actions workflow matomas
- [ ] Failai įkelti į GitHub repository
- [ ] GitHub Actions sėkmingai baigtas
- [ ] fixwize.com atsidaro
- [ ] SSL sertifikatas aktyvus

## ✅ 9. Production Testavimas

- [ ] fixwize.com atsidaro be klaidų
- [ ] Prisijungimas veikia
- [ ] Demo duomenys matomi
- [ ] Mobilusis dizainas responsive
- [ ] Visi meniu punktai veikia

## 📱 10. Funkcionalumo Testavimas

### Admin Portal:
- [ ] Dashboard statistikos
- [ ] Klientų valdymas
- [ ] Automobilių registracija
- [ ] Darbo užsakymų kūrimas
- [ ] Sąskaitų generavimas
- [ ] To-Do sąrašas
- [ ] Team management

### Customer Portal:
- [ ] Prisijungimas su telefonu
- [ ] Savo duomenų peržiūra
- [ ] Darbo užsakymų istorija
- [ ] Sąskaitų peržiūra

### Parts Supplier Portal:
- [ ] Prisijungimas
- [ ] Užklausų peržiūra
- [ ] Pasiūlymų kūrimas

## 🔄 11. Automatinio Deployment Testavimas

- [ ] Mažas pakeitimas kode
- [ ] Failai įkelti į GitHub per web interface
- [ ] GitHub Actions automatiškai paleistas
- [ ] Pakeitimai matomi fixwize.com

## 📞 12. Demo Prisijungimų Testavimas

### Email/Password:
- [ ] admin@fixwize.ie / demo123
- [ ] mike@fixwize.ie / demo123
- [ ] james@email.com / demo123

### Phone Only:
- [ ] +1234567890 (Admin)
- [ ] +353 85 123 4567 (Customer)
- [ ] +353155501234 (Parts Supplier)

## 🛡️ 13. Saugumo Patikrinimas

- [ ] .env failai ne Git repository
- [ ] GitHub Secrets saugūs
- [ ] Supabase RLS policies aktyvūs
- [ ] SSL sertifikatas veikia
- [ ] Strong passwords naudojami

## 📈 14. Performance Patikrinimas

- [ ] Svetainė kraunasi < 3 sekundės
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Database queries optimizuoti

## 🎉 Sėkmingo Setup Rezultatas

Po visų žingsnių turėtumėte turėti:

✅ **Veikiančią FIXWIZE sistemą fixwize.com**
✅ **Automatinį deployment iš GitHub**
✅ **Saugų duomenų bazės valdymą**
✅ **Mobile-responsive dizainą**
✅ **SSL sertifikatą**
✅ **Demo duomenis testavimui**

## 🆘 Jei kažkas neveikia

1. **Patikrinkite GitHub Actions logs**
2. **Patikrinkite browser console (F12)**
3. **Patikrinkite Supabase logs**
4. **Patikrinkite Hostinger error logs**
5. **Susisiekite su konkrečia klaida**

## 📞 Pagalba

- **GitHub Issues:** sukurkite issue su error logs
- **Email:** su screenshot'ais
- **Console logs:** nukopijuokite visas klaidas

---

**Sėkmės su FIXWIZE sistemos paleidimu! 🚀**

**PASTABA:** Šis projektas sukurtas WebContainer aplinkoje, kur Git komandos nėra prieinamos. Failų įkėlimui į GitHub naudokite web interface arba lokalų Git setup.