import { AppLayout } from '@/components/layout/AppLayout';
import { ExpiryTimeline } from '@/components/products/ExpiryTimeline';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { products, isLoading } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const expiringCount = products.filter(p => {
    const daysLeft = Math.ceil(
      (new Date(p.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 5 && daysLeft >= 0;
  }).length;

  return (
    <AppLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm safe-area-pt">
        <div className="flex h-14 items-center justify-between px-4">
          <div>
            <h1 className="text-lg font-semibold">Hi, {user?.user_metadata?.display_name?.split(' ')[0] || 'there'} 👋</h1>
            {expiringCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {expiringCount} item{expiringCount !== 1 ? 's' : ''} expiring soon
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/inventory')}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border text-center">
            <p className="text-2xl font-bold text-primary">{products.length}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </div>
          <div className="bg-card rounded-xl p-3 border text-center">
            <p className="text-2xl font-bold text-expiry-critical">{expiringCount}</p>
            <p className="text-xs text-muted-foreground">Expiring Soon</p>
          </div>
          <div className="bg-card rounded-xl p-3 border text-center">
            <p className="text-2xl font-bold text-expiry-soon">
              {products.filter(p => new Date(p.expiry_date) > new Date()).length}
            </p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
        </div>

        {/* Expiry Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <ExpiryTimeline products={products} />
        )}
      </div>

      {/* Floating Add Button */}
      <Button
        size="lg"
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => navigate('/add-product')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </AppLayout>
  );
}
