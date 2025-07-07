import { headers } from 'next/headers';

import auth from '@/lib/auth/auth';

import EditProfileForm from './_components/EditProfileForm';

export default async function ProfilHome(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="text-white">
      <div className="flex flex-col gap-2 py-10 text-4xl">
        <p>Bienvenue {session?.user.name}</p>
        <p className="text-[#A6FF00]">Voici ton profil</p>
      </div>
      <EditProfileForm />
    </div>
  );
}
