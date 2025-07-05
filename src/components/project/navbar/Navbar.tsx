'use server';

import { User } from 'lucide-react';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import auth from '@/lib/auth/auth';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

const NavBar = async (): Promise<React.JSX.Element> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <nav className="flex flex-col gap-10 p-10">
      <div className="flex items-center justify-between">
        <div className="w-[190px]">
          <Image {...images.YORZ_LOGO_LETTER} className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center gap-4">
          <Link href={session?.user ? routes.profil : routes.auth.login}>
            <User size={30} color="white" />
          </Link>
          <div className="w-10">
            <Image {...images.FRENCH_FLAG} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 font-medium text-white uppercase">
        <Link href={routes.portfolio}>
          <p>Portfolio</p>
        </Link>
        <Link href={routes.tarifs}>
          <p>Tarifs</p>
        </Link>
        <Link href={routes.contact}>
          <p>Contact</p>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
