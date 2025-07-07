const routes = {
  home: '/',
  admin: {
    home: '/admin',
    portfolio: {
      home: '/admin/portfolio',
      item: '/admin/portfolio/item',
    },
    categories: '/admin/categories',
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
    register: '/register',
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
