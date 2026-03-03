export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  shortDescription: string;
  inci: string;
};

export const products: Product[] = [
  { slug: 'crema-viso-luce', name: 'Crema Viso Luce', price: 24.9, category: 'Viso', image: 'https://picsum.photos/seed/crema1/600/380', shortDescription: 'Texture leggera con vitamina C per luminosità quotidiana.', inci: 'Aqua, Glycerin, Ascorbic Acid, Tocopherol, Aloe Barbadensis Leaf Juice.' },
  { slug: 'siero-ialuronico', name: 'Siero Ialuronico 2%', price: 29.5, category: 'Viso', image: 'https://picsum.photos/seed/crema2/600/380', shortDescription: 'Idratazione intensiva e effetto rimpolpante.', inci: 'Aqua, Sodium Hyaluronate, Panthenol, Allantoin.' },
  { slug: 'detergente-delicato', name: 'Detergente Delicato', price: 14.0, category: 'Detersione', image: 'https://picsum.photos/seed/crema3/600/380', shortDescription: 'Mousse morbida per pelli sensibili.', inci: 'Aqua, Cocamidopropyl Betaine, Glycerin, Chamomilla Recutita Extract.' },
  { slug: 'scrub-corpo-zucchero', name: 'Scrub Corpo Zucchero', price: 19.9, category: 'Corpo', image: 'https://picsum.photos/seed/crema4/600/380', shortDescription: 'Esfoliazione delicata con oli nutrienti.', inci: 'Sucrose, Prunus Amygdalus Dulcis Oil, Parfum, Vitamin E.' },
  { slug: 'burro-corpo-seta', name: 'Burro Corpo Seta', price: 22.0, category: 'Corpo', image: 'https://picsum.photos/seed/crema5/600/380', shortDescription: 'Nutrimento profondo con karité e jojoba.', inci: 'Butyrospermum Parkii Butter, Simmondsia Chinensis Oil, Glycerin.' },
  { slug: 'olio-capelli-nutriente', name: 'Olio Capelli Nutriente', price: 18.5, category: 'Capelli', image: 'https://picsum.photos/seed/crema6/600/380', shortDescription: 'Disciplina e protegge le punte secche.', inci: 'Argania Spinosa Kernel Oil, Cocos Nucifera Oil, Parfum.' },
  { slug: 'maschera-notte-calm', name: 'Maschera Notte Calm', price: 31.0, category: 'Viso', image: 'https://picsum.photos/seed/crema7/600/380', shortDescription: 'Trattamento notturno calmante con niacinamide.', inci: 'Aqua, Niacinamide, Bisabolol, Ceramide NP.' },
  { slug: 'tonico-rose-balance', name: 'Tonico Rose Balance', price: 16.9, category: 'Detersione', image: 'https://picsum.photos/seed/crema8/600/380', shortDescription: 'Riequilibra il pH e prepara la pelle ai trattamenti.', inci: 'Rosa Damascena Flower Water, Glycerin, Lactic Acid.' },
  { slug: 'crema-mani-protect', name: 'Crema Mani Protect', price: 9.9, category: 'Corpo', image: 'https://picsum.photos/seed/crema9/600/380', shortDescription: 'Barriera protettiva con assorbimento rapido.', inci: 'Aqua, Urea, Glycerin, Calendula Officinalis Extract.' },
  { slug: 'balsamo-labbra-soft', name: 'Balsamo Labbra Soft', price: 7.5, category: 'Labbra', image: 'https://picsum.photos/seed/crema10/600/380', shortDescription: 'Idratazione e comfort immediato.', inci: 'Cera Alba, Ricinus Communis Seed Oil, Shea Butter.' }
];
