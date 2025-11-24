import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function AnalyticsDashboard() {
  // todo: remove mock functionality - mock data
  const revenueData = [
    { week: "Week 1", revenue: 12400, orders: 84 },
    { week: "Week 2", revenue: 15200, orders: 98 },
    { week: "Week 3", revenue: 13800, orders: 92 },
    { week: "Week 4", revenue: 18900, orders: 112 },
    { week: "Week 5", revenue: 16500, orders: 105 },
    { week: "Week 6", revenue: 21200, orders: 128 },
  ];

  const categoryData = [
    { category: "Electronics", sales: 45230 },
    { category: "Fashion", sales: 32100 },
    { category: "Accessories", sales: 28400 },
    { category: "Footwear", sales: 18900 },
  ];

  const productDistribution = [
    { name: "Electronics", value: 40 },
    { name: "Fashion", value: 30 },
    { name: "Accessories", value: 20 },
    { name: "Footwear", value: 10 },
  ];

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

        {/* Revenue Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Category Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
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

          {/* Sales Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Sales Distribution</h2>
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
                  {productDistribution.map((entry, index) => (
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
                $156.42
              </p>
              <p className="text-sm text-green-500 mt-1">+12.5% vs last period</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Conversion Rate
              </p>
              <p className="text-2xl font-bold" data-testid="text-conversion-rate">
                3.24%
              </p>
              <p className="text-sm text-green-500 mt-1">+0.8% vs last period</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Customer Retention
              </p>
              <p className="text-2xl font-bold" data-testid="text-retention-rate">
                68%
              </p>
              <p className="text-sm text-green-500 mt-1">+5% vs last period</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Total Customers
              </p>
              <p className="text-2xl font-bold" data-testid="text-total-customers">
                1,234
              </p>
              <p className="text-sm text-green-500 mt-1">+156 new this period</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
