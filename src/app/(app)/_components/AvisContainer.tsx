'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

import AvisItem, { AvisItemProps } from './AvisItem';

const avis: AvisItemProps[] = [
  {
    id: 'cmcqwnsaq000107jvc3m44w9o',
    avis: "J'ai été très satisfait de la qualité de la prestation. Le service était rapide et efficace.",
    auteur: 'John Doe',
    role: 'Client',
  },
  {
    id: 'cmcqwnxw6000207jv85gp21n5',
    avis: 'Le travail de Yorz est de qualité supérieure. Il a su réaliser un site web qui correspond à mes attentes et qui est de qualité supérieure.',
    auteur: 'Maxime Anyme',
    role: 'Client',
  },
];

const AvisContainer = (): React.JSX.Element => {
  const [currentAvisIndex, setCurrentAvisIndex] = useState<number>(0);

  const handleNextAvis = (): void => {
    if (currentAvisIndex < avis.length - 1) {
      setCurrentAvisIndex(currentAvisIndex + 1);
    }
  };

  const handlePreviousAvis = (): void => {
    if (currentAvisIndex > 0) {
      setCurrentAvisIndex(currentAvisIndex - 1);
    }
  };

  const handleGoToAvis = (index: number): void => {
    setCurrentAvisIndex(index);
  };

  const currentAvis = avis[currentAvisIndex];

  return (
    <div className="flex w-fit flex-col justify-center self-center text-white">
      <div className="flex gap-10 text-white">
        <button onClick={handlePreviousAvis} aria-label="Aller à l'avis précédent">
          <ChevronLeft />
        </button>
        <div role="tabpanel" aria-labelledby={`tabs-${currentAvisIndex}`}>
          <AvisItem {...currentAvis} />
        </div>

        <button onClick={handleNextAvis} aria-label="Aller à l'avis suivant">
          <ChevronRight />
        </button>
      </div>
      <div className="mt-10 flex justify-center gap-2 text-center" role="tablist">
        {avis.map((_, index) => (
          <button
            key={index}
            onClick={() => handleGoToAvis(index)}
            className={cn(
              'h-[8px] w-[30px] cursor-pointer rounded-full bg-white',
              currentAvisIndex === index && 'bg-linear-to-r from-[#A6FF00] to-[#EAFF00]',
            )}
            aria-label={`Aller à l'avis ${index + 1}`}
            aria-current={currentAvisIndex === index}
            role="tab"
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
};

export default AvisContainer;
