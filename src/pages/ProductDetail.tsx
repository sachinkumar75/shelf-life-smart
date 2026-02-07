import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LiveCountdown } from '@/components/products/LiveCountdown';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Edit, Calendar, Package, Tag, Hash, FileText } from 'lucide-react';
import { formatExpiryDate, getExpiryUrgency, getExpiryColor } from '@/lib/expiry-utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useProducts();

  const product = products.find(p => p.id === id);

  const handleDelete = async () => {
    if (!id) return;
    await deleteProduct.mutateAsync(id);
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-60 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <span className="text-5xl mb-4">😕</span>
          <h2 className="text-xl font-semibold">Product not found</h2>
          <Button className="mt-4" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const urgency = getExpiryUrgency(product.expiry_date);

  return (
    <AppLayout showNav={false}>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm safe-area-pt">
        <div className="flex h-14 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Product Header */}
        <div className="text-center py-4">
          {product.category && (
            <span className="text-5xl mb-3 block">{product.category.icon}</span>
          )}
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Badge className={cn("mt-2", getExpiryColor(urgency))}>
            Expires {formatExpiryDate(product.expiry_date)}
          </Badge>
        </div>

        {/* Live Countdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveCountdown expiryDate={product.expiry_date} />
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{formatExpiryDate(product.expiry_date)}</p>
              </div>
            </div>

            {product.category && (
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category.icon} {product.category.name}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{product.quantity}</p>
              </div>
            </div>

            {product.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{product.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
