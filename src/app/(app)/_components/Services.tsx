'use server';

import Image from 'next/image';

import images from '@/lib/boiler-config/images';

const services: string[] = [
  'Web Design',
  'Illustration',
  'Identités Visuelles',
  'UX/UI Design',
  'GUI Design',
  'Modélisation 3D',
  'Texturing',
  'Branding',
];

const Services = async (): Promise<React.JSX.Element> => {
  return (
    <div className="flex h-fit flex-col items-center gap-5">
      <p className="text-6xl font-bold text-[#FF0066]">services</p>
      <div className="flex items-center justify-center gap-15">
        <div className="flex flex-col gap-2 text-right text-xl font-medium uppercase">
          {services.map((service, index) => (
            <div key={index}>
              <p className="text-white">{service}</p>
            </div>
          ))}
        </div>
        <div className="h-[200px] w-[3px] rounded-full bg-linear-to-r from-[#CAFF00] to-[#15FF00]" />
        <div className="relative w-[350px]">
          <Image {...images.PERSONNAGE} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Services;
