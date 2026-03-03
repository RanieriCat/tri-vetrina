export type TemplateKey = 'doctor' | 'shop' | 'psy';

export const templates = {
  doctor: {
    label: 'Vetrina Dottore',
    home: '/doctor',
    nav: [
      { href: '/doctor#servizi', label: 'Servizi' },
      { href: '/doctor#prenota', label: 'Prenota' },
      { href: '/doctor#contatti', label: 'Contatti' }
    ]
  },
  shop: {
    label: 'Lifestyle e Creme',
    home: '/shop',
    nav: [
      { href: '/shop', label: 'Home' },
      { href: '/shop/products', label: 'Prodotti' },
      { href: '/shop/cart', label: 'Carrello' },
      { href: '/shop/checkout', label: 'Checkout' }
    ]
  },
  psy: {
    label: 'Promo Psicologo',
    home: '/psy',
    nav: [
      { href: '/psy', label: 'Home' },
      { href: '/psy/chi-sono', label: 'Chi sono' },
      { href: '/psy/percorsi', label: 'Percorsi' },
      { href: '/psy/risorse', label: 'Risorse' },
      { href: '/psy/contatti', label: 'Contatti' }
    ]
  }
} as const;

export const templateKeys = Object.keys(templates) as TemplateKey[];
