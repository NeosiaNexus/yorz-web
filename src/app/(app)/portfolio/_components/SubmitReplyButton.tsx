'use client';

import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

const SubmitReplyButton = (): React.JSX.Element => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
      {pending ? 'Envoi…' : 'Répondre'}
    </Button>
  );
};

export default SubmitReplyButton;
