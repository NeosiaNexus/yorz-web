'use server';

import Image from 'next/image';

import images from '@/lib/boiler-config/images';

const features: {
  description: React.JSX.Element;
  image: typeof images.FEATURE_DISCUSSION;
}[] = [
  {
    description: (
      <p className="text-2xl text-white">
        Discussion <span className="text-[#0185FE]">fluide</span> et{' '}
        <span className="text-[#0185FE]">efficace</span>
      </p>
    ),
    image: images.FEATURE_DISCUSSION,
  },
  {
    description: (
      <p className="text-2xl text-white">
        Réalisation <span className="text-[#F10060]">rapide</span> & Prise en charge{' '}
        <span className="text-[#F10060]">intuitive</span>
      </p>
    ),
    image: images.FEATURE_TEMPS,
  },
  {
    description: (
      <p className="text-2xl text-white">
        <span className="text-[#00FF19]">Récompenses</span> pour les plus fidèles
      </p>
    ),
    image: images.FEATURE_RECOMPENSES,
  },
];

const Features = async (): Promise<React.JSX.Element> => {
  return (
    <div className="flex items-center justify-evenly gap-10">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex w-[200px] flex-col items-center gap-5 text-center font-medium"
        >
          <Image {...feature.image} />
          {feature.description}
        </div>
      ))}
    </div>
  );
};

export default Features;
