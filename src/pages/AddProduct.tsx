import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AddProductForm } from '@/components/products/AddProductForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Keyboard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [mode, setMode] = useState<'select' | 'scan' | 'manual'>('select');
  const [scannedDate, setScannedDate] = useState<string>('');
  const [scannedName, setScannedName] = useState<string>('');
  const navigate = useNavigate();

  const handleScanComplete = (date: string, name?: string) => {
    setScannedDate(date);
    if (name) setScannedName(name);
    setMode('manual');
  };

  return (
    <AppLayout>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm safe-area-pt">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => mode === 'select' ? navigate(-1) : setMode('select')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {mode === 'select' ? 'Add Product' : mode === 'scan' ? 'Scan Expiry Date' : 'Product Details'}
          </h1>
        </div>
      </header>

      <div className="p-4">
        {mode === 'select' && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              How would you like to add a product?
            </p>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => navigate('/scan')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Scan with Camera</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a photo to auto-detect expiry date
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => setMode('manual')}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center">
                  <Keyboard className="h-7 w-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Enter Manually</h3>
                  <p className="text-sm text-muted-foreground">
                    Type product details yourself
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === 'manual' && (
          <AddProductForm 
            initialExpiryDate={scannedDate} 
            initialName={scannedName}
          />
        )}
      </div>
    </AppLayout>
  );
}
