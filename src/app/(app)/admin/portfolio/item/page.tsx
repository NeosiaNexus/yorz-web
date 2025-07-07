import PortfolioItemsContainer from '@/app/(app)/PortfolioItemsContainer';

export default async function AdminPortfolioItem(): Promise<React.JSX.Element> {
  return (
    <div className="text-white">
      <div>
        <p className="font-comodo py-5 text-center text-5xl text-white">Medias</p>
        <PortfolioItemsContainer isAdmin />
      </div>
    </div>
  );
}
