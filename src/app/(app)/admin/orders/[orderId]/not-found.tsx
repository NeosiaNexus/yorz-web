import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-2 self-center justify-self-center rounded-2xl bg-red-500 p-4 text-white">
      <p>Cette commande n&apos;existe pas ou n&apos;est plus disponible.</p>
      <Button className="text-yorz-dark hover:bg-yorz-dark bg-white hover:text-white" asChild>
        <Link href={routes.admin.orders.home}>Retour à la liste des commandes</Link>
      </Button>
    </div>
  );
}
