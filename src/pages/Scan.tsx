import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Camera, Loader2, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AddProductForm } from '@/components/products/AddProductForm';

export default function Scan() {
  const [step, setStep] = useState<'camera' | 'processing' | 'confirm' | 'form'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedDate, setDetectedDate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      stopCamera();
      processImage(imageData);
    }
  }, [stopCamera]);

  const processImage = async (imageData: string) => {
    setStep('processing');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('extract-expiry', {
        body: { image: imageData }
      });

      if (error) throw error;

      if (data?.expiry_date) {
        setDetectedDate(data.expiry_date);
        setStep('confirm');
      } else {
        toast({
          title: 'No Date Found',
          description: 'Could not detect an expiry date. Please try again or enter manually.',
        });
        setStep('camera');
        setCapturedImage(null);
        startCamera();
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: 'Processing Error',
        description: 'Failed to process image. Please try again.',
        variant: 'destructive',
      });
      setStep('camera');
      setCapturedImage(null);
      startCamera();
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setDetectedDate('');
    setStep('camera');
    startCamera();
  };

  const confirmDate = () => {
    setStep('form');
  };

  // Start camera on mount
  useState(() => {
    startCamera();
    return () => stopCamera();
  });

  return (
    <AppLayout showNav={false}>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm safe-area-pt">
        <div className="flex h-14 items-center gap-3 px-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              stopCamera();
              navigate(-1);
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {step === 'form' ? 'Add Product' : 'Scan Expiry Date'}
          </h1>
        </div>
      </header>

      <div className="p-4">
        {step === 'camera' && (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Point your camera at the expiry date on the product packaging
            </p>
            
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-48 border-2 border-dashed border-primary/50 rounded-lg" />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14"
              onClick={captureImage}
            >
              <Camera className="mr-2 h-5 w-5" />
              Capture
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium">Analyzing Image...</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detecting expiry date using AI
            </p>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <span className="text-4xl mb-4 block">📅</span>
                <h3 className="text-lg font-medium">Expiry Date Detected!</h3>
                <p className="text-3xl font-bold text-primary mt-2">{detectedDate}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Is this correct?
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={retake}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button className="flex-1" onClick={confirmDate}>
                <Check className="mr-2 h-4 w-4" />
                Confirm
              </Button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <AddProductForm initialExpiryDate={detectedDate} />
        )}
      </div>
    </AppLayout>
  );
}
