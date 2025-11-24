import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHome() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: isAuthenticated && isAdmin,
  });

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Redirect to="/login" />;
  }

  const isLoading = productsLoading || ordersLoading || usersLoading;

  // Calculate stats from real data
  const totalRevenue = orders?.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalCustomers = users?.filter((u: any) => u.role === 'user').length || 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+20.1%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Orders",
      value: totalOrders.toString(),
      change: "+12.5%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      change: "+4.2%",
      icon: Package,
      trend: "up",
    },
    {
      title: "Customers",
      value: totalCustomers.toString(),
      change: "+8.3%",
      icon: Users,
      trend: "up",
    },
  ];

  // Get recent orders (last 5)
  const recentOrders = orders?.slice(-5).reverse() || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Pending":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            stats.map((stat, index) => (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                    data-testid={`badge-change-${index}`}
                  >
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </p>
              </Card>
            ))
          )}
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 transition-all"
                >
                  <div>
                    <p className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                      {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold" data-testid={`text-order-total-${order.id}`}>
                      ${parseFloat(order.total).toFixed(2)}
                    </p>
                    <Badge
                      className={getStatusColor(order.status)}
                      data-testid={`badge-order-status-${order.id}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
