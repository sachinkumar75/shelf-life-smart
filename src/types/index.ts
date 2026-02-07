export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  notification_days_before: number;
  push_notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  expiry_date: string;
  quantity: number;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export type ExpiryUrgency = 
  | 'critical'   // ≤2 days
  | 'urgent'     // ≤5 days
  | 'warning'    // ≤10 days
  | 'soon'       // ≤15 days
  | 'month'      // ≤30 days
  | 'sixmonths'  // ≤180 days
  | 'year'       // ≤365 days
  | 'safe';      // >365 days

export interface ExpiryTimelineGroup {
  label: string;
  urgency: ExpiryUrgency;
  products: Product[];
  icon: string;
}
