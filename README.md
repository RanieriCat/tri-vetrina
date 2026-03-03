# Tri Vetrina (Astro)

Progetto Astro unico con 3 template demo di sito vetrina:
- `/doctor` — Vetrina Dottore (single page)
- `/shop` — Lifestyle e Creme (shop demo con carrello/checkout mock)
- `/psy` — Promo Psicologo

## Avvio progetto
```bash
npm install
npm run dev
```

Apri `http://localhost:4321`.
La route `/` reindirizza automaticamente all'ultimo template selezionato dal **Template Switcher** (persistenza in `localStorage`).

## Struttura principale
- `src/layouts/MainLayout.astro`: layout condiviso con header, nav e switch template.
- `src/components/`: switcher, SEO head, card prodotto.
- `src/pages/`: routing completo dei 3 template e pagine legali shop.
- `src/content/risorse/`: articoli markdown per template psicologo.
- `src/styles/global.css`: tema base + varianti visual per doctor/shop/psy.
