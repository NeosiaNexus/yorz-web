interface Image {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const images: Record<string, Image> = {
  YORZ_LOGO_LETTER: {
    src: '/images/yorz-letter-logo.png',
    width: 2244,
    height: 464,
    alt: 'Logo de yorz en version lettre',
  },
  FRENCH_FLAG: {
    src: '/images/french-flag.png',
    width: 50,
    height: 40,
    alt: 'Drapeau de la France',
  },
  DONNEZ_VIE_LOGO: {
    src: '/images/donnez-vie-logo.png',
    width: 581,
    height: 343,
    alt: 'Slogan de Yorz',
  },
  SOCIAL_DISCORD: {
    src: '/images/socials/discord-logo.png',
    width: 75,
    height: 61,
    alt: 'Logo de discord',
  },
  SOCIAL_INSTAGRAM: {
    src: '/images/socials/instagram-logo.png',
    width: 63,
    height: 63,
    alt: 'Logo de instagram',
  },
  SOCIAL_X: {
    src: '/images/socials/x-logo.png',
    width: 53,
    height: 54,
    alt: 'Logo de x',
  },
  TCHAT: {
    src: '/images/tchat.png',
    width: 102,
    height: 85,
    alt: "Logo d'une bulle de tchat",
  },
  SLAYER_ADVENTURE_LOGO_WHITE: {
    src: '/svg/slayer-adventure-logo-white.svg',
    width: 421,
    height: 129,
    alt: 'Logo de Slayer Adventure en blanc',
  },
  PERSONNAGE: {
    src: '/images/personnage.png',
    width: 783,
    height: 998,
    alt: 'Personnage de Yorz',
  },
};

export default images;
