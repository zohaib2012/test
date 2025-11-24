import { useEffect } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Package, MapPin, CreditCard, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

type Order = {
  id: string;
  userId: string;
  status: string;
  total: string;
  createdAt: string;
};

export default function AccountPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "processing":
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "";
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold" data-testid="text-user-name">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
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
                  {isLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No orders yet
                    </div>
                  ) : (
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
                                  Order #{order.id}
                                </h3>
                                <Badge
                                  className={getStatusColor(order.status)}
                                  data-testid={`badge-status-${order.id}`}
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className="text-xl font-bold mb-2"
                                data-testid={`text-order-total-${order.id}`}
                              >
                                ${parseFloat(order.total).toFixed(2)}
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
                  )}
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
