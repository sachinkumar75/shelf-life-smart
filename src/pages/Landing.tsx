import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Clock, Camera, Bell, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const [showAuth, setShowAuth] = useState<'signin' | 'signup' | null>(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Camera,
      title: 'Smart Scanning',
      description: 'Scan product labels with your camera to automatically detect expiry dates',
    },
    {
      icon: Clock,
      title: 'Live Countdown',
      description: 'Real-time timers show exactly when each product expires',
    },
    {
      icon: Bell,
      title: 'Timely Alerts',
      description: 'Get notified before products expire so nothing goes to waste',
    },
    {
      icon: ShieldCheck,
      title: 'Organized Inventory',
      description: 'Categorize and search your products for easy management',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      {showAuth ? (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setShowAuth(null)}>
              ← Back
            </Button>
          </div>
          <AuthForm mode={showAuth} />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {showAuth === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setShowAuth('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setShowAuth('signin')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          {/* Hero Section */}
          <header className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-6">
              <span className="text-6xl">⏰</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Smart Expiry
              <span className="text-primary"> Reminder</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Never let products expire again. Track, scan, and get reminded before it's too late.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => setShowAuth('signup')}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowAuth('signin')}>
                Sign In
              </Button>
            </div>
          </header>

          {/* Features Section */}
          <section className="px-4 py-12 bg-card/50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">
                Everything You Need to Stay Organized
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 p-4 rounded-xl bg-card shadow-sm border"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-6 text-center text-sm text-muted-foreground">
            <p>Track expiries for groceries, medicines, personal items & more</p>
          </footer>
        </div>
      )}
    </div>
  );
}
