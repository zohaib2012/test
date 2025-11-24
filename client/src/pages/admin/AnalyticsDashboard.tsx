import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Download } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function AnalyticsDashboard() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated && isAdmin,
  });

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Redirect to="/login" />;
  }

  const isLoading = ordersLoading || productsLoading;

  // Calculate analytics from real data
  const totalRevenue = orders?.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Category sales data
  const categorySales = categories?.map((category: any) => {
    const categoryProducts = products?.filter((p: any) => p.categoryId === category.id) || [];
    const sales = categoryProducts.reduce((sum: number, product: any) => {
      return sum + (parseFloat(product.price) * (product.reviewCount || 1));
    }, 0);
    return {
      category: category.name,
      sales: Math.round(sales),
    };
  }) || [];

  // Product distribution
  const productDistribution = categories?.map((category: any) => {
    const count = products?.filter((p: any) => p.categoryId === category.id).length || 0;
    return {
      name: category.name,
      value: count,
    };
  }).filter((item: any) => item.value > 0) || [];

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-analytics-title">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your sales performance and trends
            </p>
          </div>
          <div className="flex gap-4">
            <Select defaultValue="6weeks">
              <SelectTrigger className="w-[180px]" data-testid="select-date-range">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6weeks">Last 6 Weeks</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" data-testid="button-export-analytics">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-96" />
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Category Performance */}
              {categorySales.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Category Performance</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categorySales}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Sales Distribution */}
              {productDistribution.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-6">Product Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={productDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {productDistribution.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>

            {/* Key Metrics */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Average Order Value
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-avg-order-value">
                    ${avgOrderValue.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {totalOrders} orders
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-conversion-rate">
                    ${totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    All time revenue
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-retention-rate">
                    {products?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    In inventory
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold" data-testid="text-total-customers">
                    {totalOrders}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    All time orders
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
