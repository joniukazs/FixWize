# FIXWIZE Deployment Checklist ✅

## Prieš Deployment

- [ ] Kodas veikia lokaliai (`npm run dev`)
- [ ] Build sukuriamas be klaidų (`npm run build`)
- [ ] Supabase projektas sukurtas ir migracijos paleistos
- [ ] Hostinger FTP duomenys žinomi
- [ ] GitHub repository sukurtas

## GitHub Actions Setup

- [ ] `.github/workflows/deploy.yml` failas sukurtas
- [ ] GitHub Secrets sukonfigūruoti:
  - [ ] `FTP_HOST`
  - [ ] `FTP_USERNAME` 
  - [ ] `FTP_PASSWORD`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`

## Po Deployment

- [ ] Svetainė atsidaro (fixwize.com)
- [ ] SSL sertifikatas veikia (https://)
- [ ] Prisijungimas veikia
- [ ] Demo duomenys matomi
- [ ] Mobilusis dizainas veikia
- [ ] Visi meniu punktai atsidaro

## Demo Prisijungimo Testavimas

- [ ] Email: admin@fixwize.ie / Password: demo123
- [ ] Phone: +1234567890 (Admin)
- [ ] Phone: +353 85 123 4567 (Customer)

## Funkcionalumo Testavimas

- [ ] Dashboard statistikos rodomos
- [ ] Klientų sąrašas veikia
- [ ] Darbo užsakymų kūrimas
- [ ] Automobilių registracija
- [ ] Sąskaitų generavimas
- [ ] To-Do sąrašas
- [ ] Team chat

## Troubleshooting

Jei kažkas neveikia:
1. Patikrinkite GitHub Actions logs
2. Patikrinkite browser console (F12)
3. Patikrinkite Hostinger error logs
4. Patikrinkite Supabase connection

## Kontaktai Pagalbai

- GitHub Issues: sukurkite issue su klaidos aprašymu
- Email: su screenshot'ais ir error message
- Browser console logs: nukopijuokite klaidas

## Sėkmingo Deployment Požymiai

✅ **Svetainė atsidaro be klaidų**
✅ **Prisijungimas veikia**  
✅ **Duomenys kraunasi**
✅ **Mobilusis dizainas responsive**
✅ **SSL sertifikatas aktyvus**
✅ **Greitas loading laikas**

## Ateities Atnaujinimai

Kai aš padarysiu pakeitimus:
1. `git pull origin main`
2. `git push origin main` 
3. Automatiškai deploy'ins! 🚀