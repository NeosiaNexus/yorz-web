'use client';

import { useFormStatus } from 'react-dom';

const PendingFieldset = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const { pending } = useFormStatus();
  return (
    <fieldset disabled={pending} aria-busy={pending} aria-disabled={pending}>
      {children}
    </fieldset>
  );
};

export default PendingFieldset;
