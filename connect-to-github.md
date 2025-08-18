# Kaip sujungti su GitHub Repository

## 1. Terminale (jūsų projekto aplanke):

```bash
# Inicializuokite Git (jei dar nepadaryta)
git init

# Pridėkite visus failus
git add .

# Sukurkite pirmą commit
git commit -m "FIXWIZE sistema - pradinė versija v1.0"

# Nustatykite main branch
git branch -M main

# Pridėkite GitHub remote (pakeiskite joniukazs į savo username)
git remote add origin https://github.com/joniukazs/fixwize.git

# Push'inkite kodą į GitHub
git push -u origin main
```

## 2. Patikrinkite GitHub:
- Atnaujinkite GitHub puslapį
- Turėtumėte matyti visus projekto failus
- Turėtumėte matyti "Actions" tab

## 3. Kitas žingsnis - GitHub Secrets:
Po sėkmingo push'o reikės sukonfigūruoti GitHub Secrets deployment'ui.

## Jei klaidos:
```bash
# Jei authentication klaida
git config --global user.name "Jūsų Vardas"
git config --global user.email "jūsų@email.com"

# Jei remote klaida
git remote -v  # patikrinkite ar teisingas URL
```