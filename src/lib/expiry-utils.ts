import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, parseISO } from "date-fns";
import { ExpiryUrgency, Product, ExpiryTimelineGroup } from "@/types";

export function getExpiryUrgency(expiryDate: string): ExpiryUrgency {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = parseISO(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const daysUntilExpiry = differenceInDays(expiry, today);
  
  if (daysUntilExpiry <= 2) return 'critical';
  if (daysUntilExpiry <= 5) return 'urgent';
  if (daysUntilExpiry <= 10) return 'warning';
  if (daysUntilExpiry <= 15) return 'soon';
  if (daysUntilExpiry <= 30) return 'month';
  if (daysUntilExpiry <= 180) return 'sixmonths';
  if (daysUntilExpiry <= 365) return 'year';
  return 'safe';
}

export function getExpiryColor(urgency: ExpiryUrgency): string {
  const colors: Record<ExpiryUrgency, string> = {
    critical: 'bg-expiry-critical text-white',
    urgent: 'bg-expiry-urgent text-white',
    warning: 'bg-expiry-warning text-foreground',
    soon: 'bg-expiry-soon text-white',
    month: 'bg-expiry-month text-white',
    sixmonths: 'bg-expiry-safe/50 text-foreground',
    year: 'bg-expiry-safe/30 text-foreground',
    safe: 'bg-expiry-safe/20 text-foreground',
  };
  return colors[urgency];
}

export function getExpiryBorderColor(urgency: ExpiryUrgency): string {
  const colors: Record<ExpiryUrgency, string> = {
    critical: 'border-l-expiry-critical',
    urgent: 'border-l-expiry-urgent',
    warning: 'border-l-expiry-warning',
    soon: 'border-l-expiry-soon',
    month: 'border-l-expiry-month',
    sixmonths: 'border-l-expiry-safe/50',
    year: 'border-l-expiry-safe/30',
    safe: 'border-l-expiry-safe/20',
  };
  return colors[urgency];
}

export function getTimelineLabel(urgency: ExpiryUrgency): string {
  const labels: Record<ExpiryUrgency, string> = {
    critical: 'Expiring within 2 days',
    urgent: 'Expiring within 5 days',
    warning: 'Expiring within 10 days',
    soon: 'Expiring within 15 days',
    month: 'Expiring within 1 month',
    sixmonths: 'Expiring within 6 months',
    year: 'Expiring within 1 year',
    safe: 'Beyond 1 year',
  };
  return labels[urgency];
}

export function getTimelineIcon(urgency: ExpiryUrgency): string {
  const icons: Record<ExpiryUrgency, string> = {
    critical: '🔴',
    urgent: '🟠',
    warning: '🟡',
    soon: '🟢',
    month: '🔵',
    sixmonths: '⚪',
    year: '⚪',
    safe: '⚪',
  };
  return icons[urgency];
}

export function groupProductsByExpiry(products: Product[]): ExpiryTimelineGroup[] {
  const urgencyOrder: ExpiryUrgency[] = ['critical', 'urgent', 'warning', 'soon', 'month', 'sixmonths', 'year', 'safe'];
  
  const groups: Record<ExpiryUrgency, Product[]> = {
    critical: [],
    urgent: [],
    warning: [],
    soon: [],
    month: [],
    sixmonths: [],
    year: [],
    safe: [],
  };
  
  products.forEach(product => {
    const urgency = getExpiryUrgency(product.expiry_date);
    groups[urgency].push(product);
  });
  
  return urgencyOrder
    .filter(urgency => groups[urgency].length > 0)
    .map(urgency => ({
      label: getTimelineLabel(urgency),
      urgency,
      products: groups[urgency].sort((a, b) => 
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      ),
      icon: getTimelineIcon(urgency),
    }));
}

export function getCountdown(expiryDate: string): { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } {
  const now = new Date();
  const expiry = parseISO(expiryDate);
  expiry.setHours(23, 59, 59, 999); // End of expiry day
  
  if (now > expiry) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  const totalSeconds = Math.floor((expiry.getTime() - now.getTime()) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { days, hours, minutes, seconds, isExpired: false };
}

export function formatExpiryDate(expiryDate: string): string {
  const date = parseISO(expiryDate);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = parseISO(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return differenceInDays(expiry, today);
}
