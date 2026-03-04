export type TemplateKey = 'doctor' | 'shop' | 'photo';

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
  photo: {
    label: 'Portfolio Fotografo',
    home: '/photo',
    nav: [
      { href: '/photo', label: 'Home' },
      { href: '/photo/portfolio', label: 'Portfolio' },
      { href: '/photo/servizi', label: 'Servizi' },
      { href: '/photo/stile', label: 'Stile' },
      { href: '/photo/contatti', label: 'Contatti' }
    ]
  }
} as const;

export const templateKeys = Object.keys(templates) as TemplateKey[];
