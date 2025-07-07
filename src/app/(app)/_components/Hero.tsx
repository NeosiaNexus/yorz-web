'use server';

import Image from 'next/image';
import Link from 'next/link';

import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

const socials = [
  {
    href: routes.socials.instagram,
    image: images.SOCIAL_INSTAGRAM,
  },
  {
    href: routes.socials.discord,
    image: images.SOCIAL_DISCORD,
  },
  {
    href: routes.socials.x,
    image: images.SOCIAL_X,
  },
];

const Hero = async (): Promise<React.JSX.Element> => {
  return (
    <div className="flex flex-col gap-5 px-10">
      <div className="flex flex-col items-center justify-center gap-5">
        <Image {...images.DONNEZ_VIE_LOGO} />
        <div className="flex gap-4">
          {socials.map((social, index) => (
            <Link
              href={social.href}
              target="_blank"
              key={index}
              className="transition-all duration-300 hover:scale-110"
            >
              <Image {...social.image} />
            </Link>
          ))}
        </div>
      </div>
      <p className="w-[280px] text-xl font-normal text-white">
        Envie de créer votre serveur minecraft ? mais marre d’aller chercher des prestataires sur
        tous les fronts ? ça tombe bien, ici ...
      </p>
      <Link href={routes.contact} className="animate-bounce self-end">
        <Image {...images.TCHAT} />
      </Link>
    </div>
  );
};

export default Hero;
