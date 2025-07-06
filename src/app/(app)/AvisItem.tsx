'use client';

import React from 'react';

export interface AvisItemProps {
  id: string;
  avis: string;
  auteur: string;
  role: string;
}

const AvisItem: React.FC<AvisItemProps> = ({ avis, auteur, role }): React.JSX.Element => {
  return (
    <div className="justify- flex w-[500px] flex-col items-center gap-4 text-center">
      <p className="text-2xl">&quot;{avis}&quot;</p>
      <div className="flex gap-2">
        <div className="h-6 w-6 rounded-full bg-white" /> - <span>{auteur}, </span>{' '}
        <span>{role}</span>
      </div>
    </div>
  );
};

export default AvisItem;
