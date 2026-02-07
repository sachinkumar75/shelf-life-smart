

# Smart Expiry Reminder - Product Lifecycle Tracker

## Overview
A mobile-friendly web application that helps users track expiry dates of everyday products, receive timely alerts, and never let products go to waste again.

---

## Core Features

### 1. User Authentication
- Secure login and signup with email/password
- User profile management
- Personal dashboard after login

### 2. Product Scanning & Entry
- **Camera Scanner**: Use smartphone camera to capture product packaging
- **AI-Powered OCR**: Automatically detect and extract expiry dates from images using AI text recognition
- **Smart Flow**: After date detection, prompt user to enter/confirm item name
- **Manual Entry**: Option to manually add products without scanning

### 3. Inventory Management
- **Pre-defined Categories**:
  - 🥬 Groceries
  - 💊 Medicines
  - 🧴 Personal Items
- **Custom Categories**: Users can create their own categories
- **Product Details**: Name, expiry date, category, quantity, notes

### 4. Expiry Timeline Tracking
Visual dashboard showing products organized by urgency:
- 🔴 Expiring within 2 days (critical)
- 🟠 Expiring within 5 days
- 🟡 Expiring within 10 days
- 🟢 Expiring within 15 days
- 🔵 Expiring within 1 month
- ⚪ Expiring within 6 months
- ⚪ Expiring within 1 year
- ⚪ Beyond 1 year

### 5. Live Expiry Timer
- Click any product to see a real-time countdown timer
- Displays days, hours, minutes, seconds until expiration
- Visual urgency indicators based on time remaining

### 6. Search & Filter
- Search products by name
- Filter by category
- Sort by expiry date (soonest first)

### 7. Push Notifications
- Browser push notifications for expiring products
- Configurable reminder timing (e.g., 3 days before, 1 day before)
- Daily digest of items expiring soon

---

## Pages & Navigation

1. **Landing Page**: App introduction with login/signup
2. **Dashboard**: Overview of inventory with expiry timeline view
3. **Add Product**: Camera scanner + manual entry form
4. **Product Detail**: Live countdown timer + edit/delete options
5. **Inventory**: Full list with search and category filters
6. **Notifications Settings**: Configure reminder preferences
7. **Profile**: User settings and category management

---

## Technical Approach

- **Backend**: Lovable Cloud for database, authentication, and edge functions
- **AI/OCR**: Lovable AI for text extraction from product images
- **Camera Access**: Web-based camera API for mobile scanning
- **Notifications**: Browser Push Notification API

---

## Design Direction
- Mobile-first, clean interface
- Color-coded urgency indicators (red → orange → yellow → green)
- Card-based product display
- Intuitive icons for quick visual scanning

