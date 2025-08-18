# ⚡ Greiti Deployment Žingsniai

## 1. 📁 GitHub Upload (5 min)
```
1. GitHub.com → New repository "fixwize"
2. Upload all project files
3. Commit changes
```

## 2. 🔐 GitHub Secrets (5 min)
```
Settings → Secrets → Actions → Add:
- FTP_HOST
- FTP_USERNAME  
- FTP_PASSWORD
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

## 3. 🌐 Hostinger FTP (3 min)
```
hPanel → FTP Accounts → Create new
Copy: Host, Username, Password
```

## 4. 🗄️ Supabase Setup (10 min)
```
supabase.com → New project "FIXWIZE"
SQL Editor → Run migrations
Settings → API → Copy URL & Key
```

## 5. 🚀 Deploy!
```
GitHub → Make any small change
Commit → GitHub Actions runs
Wait 2-3 minutes → fixwize.com live!
```

## ✅ Success Check:
- fixwize.com atsidaro
- Prisijungimas: admin@fixwize.ie / demo123
- Demo duomenys matomi
- Mobile responsive

**Total time: ~25 minutes** 🎉