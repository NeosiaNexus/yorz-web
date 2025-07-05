'use server';

import Image from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';

import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

const links: {
  title: string;
  href: string;
}[] = [
  {
    title: 'Portfolio',
    href: routes.portfolio,
  },
  {
    title: 'Contact',
    href: routes.contact,
  },
  {
    title: 'Accueil',
    href: routes.home,
  },
  {
    title: 'Tarifs',
    href: routes.tarifs,
  },
  {
    title: 'Discord',
    href: routes.socials.discord,
  },
];

const socials: {
  href: string;
  image: typeof images.SOCIAL_INSTAGRAM;
}[] = [
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

const Footer = async (): Promise<React.JSX.Element> => {
  return (
    <div className="flex flex-col gap-30 py-20">
      <Marquee loop={0} autoFill>
        <Image {...images.YORZ_LOGO_LETTER} className="mx-10 w-[230px]" />
      </Marquee>
      <div className="flex items-center justify-evenly text-white">
        <div className="flex flex-col gap-5">
          {socials.map((social, index) => (
            <Link href={social.href} key={index}>
              <Image {...social.image} />
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Image {...images.YORZ_LOGO_LETTER} className="w-[190px]" />
          <p className="max-w-[430px] text-xl">
            Les noms, logos, images, vidéos et autres contenus présents sur ce site appartiennent à
            leurs propriétaires respectifs. Toute utilisation sans autorisation est interdite et
            pourra faire l’objet de poursuites.
          </p>
          <div className="text-sm font-extralight">
            <p>Yorzdraw -Tout droit réservé.</p>
            <p>
              Page loaded in {(performance.now() / 1000).toString().split('.')[0]} ms |{' '}
              <Link href={routes.legals.mentionsLegales} className="underline">
                Mentions légales
              </Link>
            </p>
          </div>
        </div>
        <div className="h-[170px] w-[0.5px] bg-white" />
        <div className="flex flex-col gap-5 text-xl font-extralight uppercase">
          {links.map((link, index) => (
            <Link href={link.href} key={index}>
              {link.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
