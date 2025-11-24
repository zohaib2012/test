import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

export default function CustomerManagement() {
  // todo: remove mock functionality - mock data
  const customers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      orders: 12,
      totalSpent: 3599.88,
      joined: "2023-06-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      orders: 8,
      totalSpent: 2499.92,
      joined: "2023-08-22",
      status: "Active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      orders: 5,
      totalSpent: 1299.95,
      joined: "2023-09-10",
      status: "Active",
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@example.com",
      orders: 15,
      totalSpent: 4799.85,
      joined: "2023-05-03",
      status: "VIP",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium" data-testid={`text-customer-name-${customer.id}`}>
                          {customer.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-customer-email-${customer.id}`}>
                      {customer.email}
                    </TableCell>
                    <TableCell data-testid={`text-customer-orders-${customer.id}`}>
                      {customer.orders}
                    </TableCell>
                    <TableCell className="font-semibold" data-testid={`text-customer-spent-${customer.id}`}>
                      ${customer.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell data-testid={`text-customer-joined-${customer.id}`}>
                      {customer.joined}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.status === "VIP" ? "default" : "secondary"}
                        data-testid={`badge-customer-status-${customer.id}`}
                      >
                        {customer.status}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
