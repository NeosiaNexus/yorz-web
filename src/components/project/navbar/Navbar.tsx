'use client';

import React from 'react';

import { Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import authClient from '@/lib/auth/auth-client';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';
import { cn } from '@/lib/utils';

type NavbarVariant = 'default' | 'profil' | 'admin';

interface NavbarProps {
  variant?: NavbarVariant;
}

const defaultLinks: { label: string; href: string }[] = [
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

const profilLinks: { label: string; href: string }[] = [
  {
    label: 'Profil',
    href: routes.profil.home,
  },
];

const adminLinks: { label: string; href: string }[] = [
  {
    label: 'Accueil',
    href: routes.admin.home,
  },
  {
    label: 'Portfolio',
    href: routes.admin.portfolio.home,
  },
  {
    label: 'Retour au site',
    href: routes.home,
  },
];
const NavBar: React.FC<NavbarProps> = ({ variant = 'default' }): React.JSX.Element => {
  const { data: session } = authClient.useSession();

  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-10 p-10">
      <div className="flex items-center justify-between">
        <Link href={routes.home} className="w-[190px]">
          <Image {...images.YORZ_LOGO_LETTER} className="h-full w-full object-cover" />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={session?.user ? routes.profil.home : routes.auth.login}
            aria-label="Accéder à mon profil"
            aria-current={pathname.startsWith(routes.profil.home)}
          >
            <User size={30} color="white" />
          </Link>
          <div className="w-10">
            <Image {...images.FRENCH_FLAG} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex flex-col gap-3 font-medium text-white uppercase',
          variant === 'admin' && 'flex-row items-center justify-center gap-10',
        )}
      >
        {variant === 'default' && (
          <>
            {defaultLinks.map(link => (
              <Link
                href={link.href}
                className={cn('relative w-fit', pathname.startsWith(link.href) && 'text-[#A6FF00]')}
                key={link.label}
              >
                <p className='transition-all duration-300 content-[""] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-[0px] before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[""] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:h-[2px] hover:before:w-full hover:before:rounded-full hover:before:bg-white'>
                  {link.label}
                </p>
              </Link>
            ))}
            {session?.user.role?.split(',').includes('admin') && (
              <Link
                href={routes.admin.home}
                className="relative flex w-fit items-center gap-1 text-[#FF0066]"
              >
                <p className='transition-all duration-300 content-[""] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-[0px] before:rounded-full before:bg-[#FF0066] before:transition-all before:duration-300 before:content-[""] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:h-[2px] hover:before:w-full hover:before:rounded-full hover:before:bg-[#FF0066]'>
                  Administration
                </p>
                <Settings className="animate-spin" />
              </Link>
            )}
          </>
        )}
        {variant === 'profil' &&
          profilLinks.map(link => (
            <Link
              href={link.href}
              className={cn('relative w-fit', pathname.startsWith(link.href) && 'text-[#A6FF00]')}
              key={link.label}
            >
              <p className='transition-all duration-300 content-[""] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-[0px] before:rounded-full before:bg-white before:transition-all before:duration-300 before:content-[""] hover:before:absolute hover:before:bottom-0 hover:before:left-0 hover:before:h-[2px] hover:before:w-full hover:before:rounded-full hover:before:bg-white'>
                {link.label}
              </p>
            </Link>
          ))}
        {variant === 'admin' &&
          adminLinks.map(link => (
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
