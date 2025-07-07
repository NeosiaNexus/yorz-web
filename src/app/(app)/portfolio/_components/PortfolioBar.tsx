import { ArrowDownRight } from 'lucide-react';

const PortfolioBar = (): React.JSX.Element => {
  return (
    <div className="flex items-center gap-15 px-50">
      <div className="flex items-center gap-1 text-2xl text-white transition-all duration-300 hover:translate-y-[-5px] hover:cursor-pointer">
        <p>Filtres</p>
        <ArrowDownRight color="#F10060" />
      </div>
      <div className="flex items-center gap-1 text-2xl text-white transition-all duration-300 hover:translate-y-[-5px] hover:cursor-pointer">
        <p>Catégories</p>
        <ArrowDownRight color="#F10060" />
      </div>
    </div>
  );
};

export default PortfolioBar;
