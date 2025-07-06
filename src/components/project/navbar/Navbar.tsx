'use server';

import { User } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import auth from '@/lib/auth/auth';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

const links: { label: string; href: string }[] = [
  {
    label: 'Portfolio',
    href: routes.portfolio,
  },
  {
    label: 'Tarifs',
    href: routes.tarifs,
  },
  {
    label: 'Contact',
    href: routes.contact,
  },
];

const NavBar = async (): Promise<React.JSX.Element> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="flex flex-col gap-10 p-10">
      <div className="flex items-center justify-between">
        <Link href={routes.home} className="w-[190px]">
          <Image {...images.YORZ_LOGO_LETTER} className="h-full w-full object-cover" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href={session?.user ? routes.profil : routes.auth.login}>
            <User size={30} color="white" />
          </Link>
          <div className="w-10">
            <Image {...images.FRENCH_FLAG} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 font-medium text-white uppercase">
        {links.map(link => (
          <Link href={link.href} className="relative w-fit" key={link.label}>
            <p className='transition-all duration-300 content-[""] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-[0px] before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[""] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:h-[2px] hover:before:w-full hover:before:rounded-full hover:before:bg-white'>
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
