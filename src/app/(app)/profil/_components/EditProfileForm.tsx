'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Label } from '@radix-ui/react-label';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import authClient from '@/lib/auth/auth-client';

const EditProfileForm = (): React.JSX.Element => {
  const { data: session, isPending } = authClient.useSession();
  const initialNameRef = useRef<string | null>(null);

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (session?.user.name && !initialNameRef.current) {
      initialNameRef.current = session.user.name;
      setUsername(session.user.name);
    }
  }, [session?.user.name]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
  };

  const handleSaveUserName = async (): Promise<void> => {
    const trimmed = username.trim();

    if (trimmed.length < 3) {
      toast.error('Le pseudo doit contenir au moins 3 caractères.');
      return;
    }

    toast.promise(authClient.updateUser({ name: trimmed }), {
      loading: 'Enregistrement du pseudo...',
      success: () => {
        initialNameRef.current = trimmed;
        return 'Pseudo enregistré avec succès';
      },
      error: "Erreur lors de l'enregistrement du pseudo",
    });
  };

  const hasChanged = initialNameRef.current !== null && username.trim() !== initialNameRef.current;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-xl font-medium">
          Votre pseudo
        </Label>
        <div className="flex gap-2">
          <Input
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder={isPending ? 'Chargement de votre pseudo...' : 'Entrez votre pseudo'}
            minLength={3}
            disabled={isPending}
            className="w-[300px] rounded-xl border border-white py-5"
          />
          {hasChanged && (
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer rounded-xl border-none bg-[#00863A] hover:bg-[#00863A]/80 hover:text-white"
              onClick={handleSaveUserName}
              disabled={username.trim().length < 3}
            >
              <SaveIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
