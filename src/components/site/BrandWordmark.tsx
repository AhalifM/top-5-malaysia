import type { Brand } from '@/lib/content';
import { cn } from '@/lib/utils';

interface Props {
  brand: Brand;
  className?: string;
  mutedClassName?: string;
}

export default function BrandWordmark({
  brand,
  className,
  mutedClassName = 'text-foreground/80',
}: Props) {
  const highlight = brand.highlight.trim();
  const name = brand.name.trim();

  if (!highlight || !name.startsWith(highlight)) {
    return <span className={cn('font-bold tracking-tight', className)}>{name || 'Swifty Agency'}</span>;
  }

  const rest = name.slice(highlight.length);

  return (
    <span className={cn('font-bold tracking-tight', className)}>
      <span className="text-gold">{highlight}</span>
      <span className={mutedClassName}>{rest}</span>
    </span>
  );
}
