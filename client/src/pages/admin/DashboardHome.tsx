import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function DashboardHome() {
  // todo: remove mock functionality - mock data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Orders",
      value: "2,345",
      change: "+12.5%",
      icon: ShoppingCart,
      trend: "up",
    },
    {
      title: "Products",
      value: "856",
      change: "+4.2%",
      icon: Package,
      trend: "up",
    },
    {
      title: "Customers",
      value: "1,234",
      change: "+8.3%",
      icon: Users,
      trend: "up",
    },
  ];

  const salesData = [
    { name: "Mon", revenue: 4000, orders: 24 },
    { name: "Tue", revenue: 3000, orders: 18 },
    { name: "Wed", revenue: 5000, orders: 32 },
    { name: "Thu", revenue: 2780, orders: 16 },
    { name: "Fri", revenue: 6890, orders: 42 },
    { name: "Sat", revenue: 8390, orders: 55 },
    { name: "Sun", revenue: 7490, orders: 48 },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "John Doe", total: 299.99, status: "Completed" },
    { id: "ORD-002", customer: "Jane Smith", total: 1299.99, status: "Shipped" },
    { id: "ORD-003", customer: "Bob Johnson", total: 199.99, status: "Processing" },
    { id: "ORD-004", customer: "Alice Brown", total: 499.99, status: "Pending" },
  ];

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
          {stats.map((stat, index) => (
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
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Weekly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover-elevate active-elevate-2 transition-all"
              >
                <div>
                  <p className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                    {order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold" data-testid={`text-order-total-${order.id}`}>
                    ${order.total.toFixed(2)}
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
        </Card>
      </div>
    </AdminLayout>
  );
}
