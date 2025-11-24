import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export default function CustomerManagement() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && isAdmin,
  });

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32" />
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Redirect to="/login" />;
  }

  const customers = users?.filter((u: any) => u.role === 'user') || [];

  const getCustomerStats = (userId: string) => {
    const customerOrders = orders?.filter((o: any) => o.userId === userId) || [];
    const totalSpent = customerOrders.reduce((sum: number, order: any) => 
      sum + parseFloat(order.total || 0), 0);
    return {
      orderCount: customerOrders.length,
      totalSpent,
    };
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-customers-title">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            View and manage customer information
          </p>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              data-testid="input-search-customers"
            />
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <div className="overflow-x-auto">
            {usersLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : customers.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>No customers found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer: any) => {
                    const stats = getCustomerStats(customer.id);
                    const isVIP = stats.totalSpent > 1000;
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(customer.firstName, customer.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium" data-testid={`text-customer-name-${customer.id}`}>
                              {customer.firstName} {customer.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground" data-testid={`text-customer-email-${customer.id}`}>
                          {customer.email}
                        </TableCell>
                        <TableCell data-testid={`text-customer-orders-${customer.id}`}>
                          {stats.orderCount}
                        </TableCell>
                        <TableCell className="font-semibold" data-testid={`text-customer-spent-${customer.id}`}>
                          ${stats.totalSpent.toFixed(2)}
                        </TableCell>
                        <TableCell data-testid={`text-customer-joined-${customer.id}`}>
                          {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={isVIP ? "default" : "secondary"}
                            data-testid={`badge-customer-status-${customer.id}`}
                          >
                            {isVIP ? "VIP" : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-view-customer-${customer.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
