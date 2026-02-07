import { Product } from '@/types';
import { groupProductsByExpiry, getExpiryColor } from '@/lib/expiry-utils';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ExpiryTimelineProps {
  products: Product[];
}

export function ExpiryTimeline({ products }: ExpiryTimelineProps) {
  const groups = groupProductsByExpiry(products);

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">📦</span>
        <h3 className="text-lg font-medium text-foreground">No products yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first product to start tracking expiry dates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.urgency}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{group.icon}</span>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {group.label}
            </h2>
            <span className={cn(
              "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
              getExpiryColor(group.urgency)
            )}>
              {group.products.length}
            </span>
          </div>
          <div className="space-y-2">
            {group.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
