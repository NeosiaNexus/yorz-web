import Link from 'next/link';

type variant = 'blue' | 'red' | 'green';

interface AdminStatBlockLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  count: number;
  variant?: variant;
}

const AdminStatBlockLink = ({
  href,
  icon,
  title,
  count,
  variant = 'blue',
}: AdminStatBlockLinkProps): React.JSX.Element => {
  let color = 'bg-[#109BFE]';

  switch (variant) {
    case 'red':
      color = 'bg-[#F10060]';
      break;
    case 'green':
      color = 'bg-[#A6FF00]';
      break;
    default:
      break;
  }

  return (
    <Link
      href={href}
      className="flex h-[150px] w-[300px] items-center justify-center gap-5 rounded-3xl bg-white text-black transition-all duration-300 hover:scale-105"
    >
      <div className={`flex items-center justify-center rounded-full p-3 ${color}`}>{icon}</div>
      <div>
        <p className="text-4xl font-bold">{count}</p>
        <p className="max-w-[100px]">{title}</p>
      </div>
    </Link>
  );
};

export default AdminStatBlockLink;
