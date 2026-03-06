export type Product = {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  shortDescription: string;
  inci: string;
  variantId?: string;
  variantTitle?: string;
};

export const products: Product[] = [
  {
    slug: 'crema-viso-luce',
    name: 'Crema Viso Luce',
    price: 24.9,
    category: 'Viso',
    image: 'https://images.pexels.com/photos/7143283/pexels-photo-7143283.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Crema viso leggera con vitamina C per una luminosita quotidiana.',
    inci: 'Aqua, Glycerin, Ascorbic Acid, Tocopherol, Aloe Barbadensis Leaf Juice.'
  },
  {
    slug: 'siero-ialuronico',
    name: 'Siero Ialuronico 2%',
    price: 29.5,
    category: 'Viso',
    image: 'https://images.pexels.com/photos/36375310/pexels-photo-36375310.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Siero idratante con effetto rimpolpante e comfort immediato.',
    inci: 'Aqua, Sodium Hyaluronate, Panthenol, Allantoin.'
  },
  {
    slug: 'detergente-delicato',
    name: 'Detergente Delicato',
    price: 14.0,
    category: 'Detersione',
    image: 'https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Detersione delicata in mousse, adatta anche a pelli sensibili.',
    inci: 'Aqua, Cocamidopropyl Betaine, Glycerin, Chamomilla Recutita Extract.'
  },
  {
    slug: 'scrub-corpo-zucchero',
    name: 'Scrub Corpo Zucchero',
    price: 19.9,
    category: 'Corpo',
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Esfoliazione delicata con oli nutrienti per pelle piu liscia.',
    inci: 'Sucrose, Prunus Amygdalus Dulcis Oil, Parfum, Vitamin E.'
  },
  {
    slug: 'burro-corpo-seta',
    name: 'Burro Corpo Seta',
    price: 22.0,
    category: 'Corpo',
    image: 'https://images.pexels.com/photos/3851790/pexels-photo-3851790.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Nutrimento corpo intenso con burro di karite e jojoba.',
    inci: 'Butyrospermum Parkii Butter, Simmondsia Chinensis Oil, Glycerin.'
  },
  {
    slug: 'olio-capelli-nutriente',
    name: 'Olio Capelli Nutriente',
    price: 18.5,
    category: 'Capelli',
    image: 'https://images.pexels.com/photos/6663374/pexels-photo-6663374.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Olio leggero che disciplina e protegge le punte secche.',
    inci: 'Argania Spinosa Kernel Oil, Cocos Nucifera Oil, Parfum.'
  },
  {
    slug: 'maschera-notte-calm',
    name: 'Maschera Notte Calm',
    price: 31.0,
    category: 'Viso',
    image: 'https://images.pexels.com/photos/3212179/pexels-photo-3212179.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Maschera notte calmante con niacinamide per pelle stressata.',
    inci: 'Aqua, Niacinamide, Bisabolol, Ceramide NP.'
  },
  {
    slug: 'tonico-rose-balance',
    name: 'Tonico Rose Balance',
    price: 16.9,
    category: 'Detersione',
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Tonico riequilibrante che prepara la pelle agli step successivi.',
    inci: 'Rosa Damascena Flower Water, Glycerin, Lactic Acid.'
  },
  {
    slug: 'crema-mani-protect',
    name: 'Crema Mani Protect',
    price: 9.9,
    category: 'Corpo',
    image: 'https://images.pexels.com/photos/36309537/pexels-photo-36309537.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Crema mani protettiva a rapido assorbimento.',
    inci: 'Aqua, Urea, Glycerin, Calendula Officinalis Extract.'
  },
  {
    slug: 'balsamo-labbra-soft',
    name: 'Balsamo Labbra Soft',
    price: 7.5,
    category: 'Labbra',
    image: 'https://images.pexels.com/photos/36327551/pexels-photo-36327551.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=600&h=380',
    shortDescription: 'Balsamo labbra con idratazione immediata e comfort duraturo.',
    inci: 'Cera Alba, Ricinus Communis Seed Oil, Shea Butter.'
  }
];

