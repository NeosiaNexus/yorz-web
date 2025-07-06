import { Label } from '@radix-ui/react-label';
import Image from 'next/image';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

export default async function Contact(): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-col gap-35">
      <p className="font-comodo bg-gradient-to-r from-[#FF0066] to-[#99003D] bg-clip-text pb-20 text-center text-7xl font-normal text-transparent">
        contact
      </p>
      <div className="flex items-center justify-center gap-25">
        <div className="flex-1">
          <p className="w-[350px] justify-self-end text-2xl text-white">
            Le moyen le plus <span className="text-[#A6FF00]">simple</span> de contacter YorzStudio,
            c’est sur <span className="text-[#A6FF00]">Discord</span>. Rejoignez-nous là-bas pour
            passer <span className="text-[#A6FF00]">commande</span> ou poser vos questions !
          </p>
        </div>

        <Link
          href={routes.socials.discord}
          className="flex-1 transition-all duration-300 hover:scale-102 hover:rotate-2"
          target="_blank"
        >
          <div className="relative w-[500px]">
            <Image {...images.YORZ_DISCORD} className="h-full w-full object-cover" />
            <p className="font-comodo absolute bottom-8 w-full text-center text-3xl text-white">
              rejoindre
            </p>
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-evenly">
        <Image {...images.YORZ_RENARD} className="w-[500px]" />
        <div className="flex flex-col gap-10 text-white">
          <div className="flex flex-col gap-3">
            <p className="font-comodo text-7xl">Envoie moi un mail !</p>
            <p className="text-2xl">
              Contactez-moi pour passer commande ou pour toute autre demande
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label>Adresse mail</Label>
              <Input className="w-[400px] rounded-2xl border-white" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Message</Label>
              <textarea className="min-h-[100px] w-[500px] rounded-2xl border-1 border-white p-2" />
            </div>
            <button className="font-comodo w-[250px] cursor-pointer rounded-2xl bg-[#00863A] py-2 text-xl transition-all duration-300 hover:scale-105">
              envoyer
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-5 pb-10">
        <Link
          href={routes.socials.instagram}
          target="_blank"
          className="transition-all duration-300 hover:scale-105"
        >
          <Image {...images.SOCIAL_INSTAGRAM} className="h-[70px] w-[70px]" />
        </Link>
        <Link
          href={routes.socials.x}
          target="_blank"
          className="transition-all duration-300 hover:scale-105"
        >
          <Image {...images.SOCIAL_X} className="h-[60px] w-[60px]" />
        </Link>
      </div>
    </div>
  );
}
