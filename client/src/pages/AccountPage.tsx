import { StorefrontHeader } from "@/components/StorefrontHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, MapPin, CreditCard, User } from "lucide-react";

export default function AccountPage() {
  // todo: remove mock functionality - mock data
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      total: 1299.99,
      status: "Delivered",
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      total: 499.98,
      status: "Shipped",
      items: 3,
    },
    {
      id: "ORD-003",
      date: "2024-01-25",
      total: 199.99,
      status: "Processing",
      items: 1,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold" data-testid="text-user-name">
                John Doe
              </h2>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                data-testid="button-nav-profile"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                data-testid="button-nav-orders"
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                data-testid="button-nav-addresses"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                data-testid="button-nav-payment"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Button>
            </nav>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders" data-testid="tab-orders">
                  Order History
                </TabsTrigger>
                <TabsTrigger value="profile" data-testid="tab-profile">
                  Profile Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order History</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card
                        key={order.id}
                        className="p-6 hover-elevate active-elevate-2 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="font-semibold text-lg"
                                data-testid={`text-order-id-${order.id}`}
                              >
                                {order.id}
                              </h3>
                              <Badge
                                className={getStatusColor(order.status)}
                                data-testid={`badge-status-${order.id}`}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {order.date} · {order.items} items
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className="text-xl font-bold mb-2"
                              data-testid={`text-order-total-${order.id}`}
                            >
                              ${order.total.toFixed(2)}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-order-${order.id}`}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profileFirstName">First Name</Label>
                        <Input
                          id="profileFirstName"
                          defaultValue="John"
                          data-testid="input-profile-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profileLastName">Last Name</Label>
                        <Input
                          id="profileLastName"
                          defaultValue="Doe"
                          data-testid="input-profile-last-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="profileEmail">Email</Label>
                      <Input
                        id="profileEmail"
                        type="email"
                        defaultValue="john@example.com"
                        data-testid="input-profile-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profilePhone">Phone</Label>
                      <Input
                        id="profilePhone"
                        type="tel"
                        defaultValue="+1 (555) 000-0000"
                        data-testid="input-profile-phone"
                      />
                    </div>

                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            data-testid="input-current-password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            data-testid="input-new-password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            data-testid="input-confirm-password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button data-testid="button-save-profile">
                        Save Changes
                      </Button>
                      <Button variant="outline" data-testid="button-cancel">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
