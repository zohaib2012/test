import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";

// Storefront Pages
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AccountPage from "@/pages/AccountPage";

// Admin Pages
import DashboardHome from "@/pages/admin/DashboardHome";
import OrderManagement from "@/pages/admin/OrderManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import CustomerManagement from "@/pages/admin/CustomerManagement";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import SettingsPage from "@/pages/admin/SettingsPage";

function Router() {
  return (
    <Switch>
      {/* Storefront Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/account" component={AccountPage} />

      {/* Admin Routes */}
      <Route path="/admin" component={DashboardHome} />
      <Route path="/admin/orders" component={OrderManagement} />
      <Route path="/admin/products" component={ProductManagement} />
      <Route path="/admin/customers" component={CustomerManagement} />
      <Route path="/admin/analytics" component={AnalyticsDashboard} />
      <Route path="/admin/settings" component={SettingsPage} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
