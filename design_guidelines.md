# E-Commerce Platform Design Guidelines

## Design Approach
**Reference-Based E-Commerce Design** drawing inspiration from Shopify, Amazon, and modern dark-themed e-commerce platforms, adapted for the specified black & red theme with dual-mode support.

## Color Theme Architecture
The user has specified a **black & red primary theme** with dark/light mode toggle:
- Dark Mode: Black backgrounds with red accents for CTAs, highlights, and interactive elements
- Light Mode: Clean white/light gray backgrounds with strategic red accent placement
- Red should emphasize: Primary CTAs, sale badges, important notifications, active states
- Maintain sufficient contrast ratios for accessibility in both modes

---

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (UI elements, body text) - weights 400, 500, 600, 700
- Headings: Poppins - weights 600, 700

**Hierarchy:**
- Hero Headlines: text-5xl to text-6xl, font-bold
- Section Titles: text-3xl to text-4xl, font-semibold
- Product Names: text-xl, font-semibold
- Body Text: text-base, font-normal
- Labels/Meta: text-sm, font-medium
- Captions: text-xs

---

## Layout & Spacing System

**Spacing Units:** Standardize on 2, 4, 6, 8, 12, 16, 20, 24, 32
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8
- Container max-width: max-w-7xl with px-4 to px-8

**Grid Systems:**
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Dashboard tables: Full-width responsive tables with horizontal scroll on mobile
- Analytics cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

---

## Storefront Design Specifications

### Navigation
Sticky header with logo left, category menu center, search/cart/account icons right. Height: h-16 to h-20. Include mega-menu dropdowns for categories with image tiles.

### Home Page Structure
1. **Hero Section** (h-[600px]): Full-width banner showcasing featured products/sale with CTA buttons (blurred backgrounds for text overlays)
2. **Featured Categories** (4-column grid): Category cards with images and overlay text
3. **Trending Products** (4-column product grid)
4. **Special Offers Banner** (2-column split with image + promotional text)
5. **Best Sellers** (horizontal scrollable product carousel)
6. **Brand Trust Section** (shipping, returns, support badges in 3-4 columns)

### Product Cards
- Image with hover zoom effect
- Product name (2-line truncation)
- Price (current + crossed-out original if on sale)
- Rating stars + review count
- Quick "Add to Cart" button on hover
- Sale badge positioned top-right on image
- Card shadow: hover:shadow-lg transition

### Product Detail Page
- 2-column layout (60% images, 40% details)
- Image gallery with thumbnails
- Breadcrumb navigation
- Product name, price, rating
- Size/color selectors as button groups
- Quantity stepper
- Large "Add to Cart" + "Buy Now" CTAs
- Tabs for Description, Specifications, Reviews
- Related products carousel at bottom

### Cart & Checkout
- Cart: Table layout with product thumbnails, quantity controls, remove option
- Summary sidebar with subtotal, shipping, total
- Checkout: Multi-step progress indicator, form sections with clear labels
- Order confirmation page with order details table

---

## Admin Dashboard Design

### Sidebar Navigation (w-64)
Fixed sidebar with logo at top, navigation items with icons (Heroicons), collapsible on mobile (hamburger menu). Active state with red accent indicator.

### Dashboard Layout
- Top bar: Breadcrumbs, search, notifications, profile dropdown, theme toggle
- Main content area: max-w-full with p-6 to p-8

### Dashboard Home
- Stats cards (4 columns): Total Revenue, Orders, Products, Customers - large numbers with trend indicators
- Sales graph (Recharts line/area chart): Weekly revenue visualization spanning full width
- Recent orders table preview
- Top products grid (3 columns)

### Order Management
- Filters: Status dropdown, date range, search
- Table columns: Order ID, Customer, Date, Items, Total, Status, Actions
- Status badges with color coding
- Row click expands detailed view with customer info, shipping address, item list, timeline
- Bulk actions toolbar

### Product Management
- Grid/List view toggle
- Add Product button (prominent, top-right)
- Product table: Thumbnail, Name, Category, Price, Stock, Status, Actions
- Form modal/page for add/edit: Image upload, title, description (rich text), category select, pricing inputs, inventory tracking

### Analytics Section
- Date range selector
- Multiple chart types: Line (revenue trends), Bar (category performance), Pie (sales distribution)
- Comparison metrics: week-over-week, month-over-month
- Export data button

### Settings Page
- Tab navigation: Profile, Store Configuration, Appearance
- Form sections with clear grouping
- Theme toggle with live preview
- Save button fixed bottom-right

---

## Component Library

**Buttons:**
- Primary CTA: px-6 py-3, rounded-lg, font-semibold (red in theme)
- Secondary: outlined version with border
- Icon buttons: p-2, rounded-full for actions

**Forms:**
- Input fields: p-3, rounded-lg, border, focus ring
- Labels: mb-2, font-medium
- Validation states: red border + error text

**Cards:**
- rounded-xl, shadow-md, p-6
- Hover: shadow-lg transition

**Tables:**
- Striped rows for better readability
- Sticky header for long tables
- Responsive: horizontal scroll on mobile

**Badges:**
- rounded-full, px-3 py-1, text-xs font-semibold
- Status-specific styling (Pending, Shipped, etc.)

**Icons:** Heroicons via CDN, size-5 to size-6 standard

---

## Images

**Hero Images:**
- Homepage: High-quality lifestyle product photography, 1920x600px minimum
- Category banners: Product compilation images with lifestyle context

**Product Images:**
- Minimum 800x800px, white/neutral background for consistency
- Multiple angles available in gallery

**Placeholder Strategy:**
- Use Unsplash API for product/lifestyle images during development
- Categories: fashion, electronics, home-decor, accessories

---

## Animation & Interactions
- Transitions: transition-all duration-300 for hovers
- Loading states: Skeleton screens for product grids
- Toast notifications for cart actions
- Minimal, purposeful animations - avoid distraction

This design ensures a professional, cohesive e-commerce experience with strong visual hierarchy, intuitive navigation, and comprehensive admin controls.