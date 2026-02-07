import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getExpiryUrgency, getExpiryColor, getExpiryBorderColor, formatExpiryDate, getDaysUntilExpiry } from '@/lib/expiry-utils';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const urgency = getExpiryUrgency(product.expiry_date);
  const daysLeft = getDaysUntilExpiry(product.expiry_date);

  const getDaysLabel = () => {
    if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`;
    if (daysLeft === 0) return 'Expires today!';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer border-l-4 transition-all hover:shadow-md",
        getExpiryBorderColor(urgency)
      )}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {product.category && (
            <span className="text-2xl">{product.category.icon}</span>
          )}
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatExpiryDate(product.expiry_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {product.quantity > 1 && (
            <Badge variant="secondary" className="text-xs">
              x{product.quantity}
            </Badge>
          )}
          <Badge className={cn("text-xs", getExpiryColor(urgency))}>
            {getDaysLabel()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
