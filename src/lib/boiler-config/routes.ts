const routes = {
  home: '/',
  admin: {
    home: '/admin',
    portfolio: {
      home: '/admin/portfolio',
      media: '/admin/portfolio/media',
      category: '/admin/portfolio/categories',
    },
    orders: {
      home: '/admin/orders',
    },
  },
  portfolio: '/portfolio',
  tarifs: '/tarifs',
  contact: '/contact',
  profil: {
    home: '/profil',
    historique: '/profil/historique',
  },
  auth: {
    login: '/login',
  },
  socials: {
    instagram: '#',
    x: '#',
    discord: '#',
  },
  legals: {
    mentionsLegales: '/mentions-legales',
  },
};

export default routes;
