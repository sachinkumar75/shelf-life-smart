import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellOff, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Notifications() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminderDays, setReminderDays] = useState('3');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Your browser does not support notifications',
        variant: 'destructive',
      });
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    setPushEnabled(result === 'granted');

    if (result === 'granted') {
      toast({
        title: 'Notifications Enabled',
        description: "You'll receive alerts before products expire",
      });
      
      // Show a test notification
      new Notification('Smart Expiry Reminder', {
        body: 'Notifications are now enabled! 🎉',
        icon: '/favicon.ico',
      });
    } else if (result === 'denied') {
      toast({
        title: 'Notifications Blocked',
        description: 'Please enable notifications in your browser settings',
        variant: 'destructive',
      });
    }
  };

  const testNotification = () => {
    if (permission === 'granted') {
      new Notification('Test Alert 🔔', {
        body: 'Your notifications are working correctly!',
        icon: '/favicon.ico',
      });
    }
  };

  return (
    <AppLayout title="Notifications">
      <div className="p-4 space-y-4">
        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Get notified when products are about to expire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permission === 'denied' ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive">
                <BellOff className="h-5 w-5" />
                <div>
                  <p className="font-medium">Notifications Blocked</p>
                  <p className="text-sm opacity-90">
                    Enable in browser settings to receive alerts
                  </p>
                </div>
              </div>
            ) : permission === 'granted' ? (
              <>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-enabled" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Enable notifications
                  </Label>
                  <Switch
                    id="push-enabled"
                    checked={pushEnabled}
                    onCheckedChange={setPushEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Remind me before expiry</Label>
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="2">2 days before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="5">5 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={testNotification} className="w-full">
                  Send Test Notification
                </Button>
              </>
            ) : (
              <Button onClick={requestPermission} className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Enable Notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-accent/50 border-accent">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <p className="font-medium">How it works</p>
                <p className="text-sm text-muted-foreground mt-1">
                  When enabled, you'll receive browser notifications reminding you about products 
                  that are about to expire. Make sure to keep this tab open or add the app to your 
                  home screen for the best experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
