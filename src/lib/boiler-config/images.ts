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
};

export default images;
