import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

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

  const getInitials = () => {
    if (!user) return "AD";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-settings-title">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your store and account settings
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile" data-testid="tab-profile">
              Profile
            </TabsTrigger>
            <TabsTrigger value="store" data-testid="tab-store">
              Store Configuration
            </TabsTrigger>
            <TabsTrigger value="appearance" data-testid="tab-appearance">
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Admin Profile</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" data-testid="button-change-avatar">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminFirstName">First Name</Label>
                    <Input
                      id="adminFirstName"
                      defaultValue={user?.firstName || ""}
                      data-testid="input-admin-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminLastName">Last Name</Label>
                    <Input
                      id="adminLastName"
                      defaultValue={user?.lastName || ""}
                      data-testid="input-admin-last-name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    defaultValue={user?.email || ""}
                    data-testid="input-admin-email"
                  />
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminCurrentPassword">
                        Current Password
                      </Label>
                      <Input
                        id="adminCurrentPassword"
                        type="password"
                        data-testid="input-admin-current-password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminNewPassword">New Password</Label>
                      <Input
                        id="adminNewPassword"
                        type="password"
                        data-testid="input-admin-new-password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminConfirmPassword">
                        Confirm Password
                      </Label>
                      <Input
                        id="adminConfirmPassword"
                        type="password"
                        data-testid="input-admin-confirm-password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button data-testid="button-save-profile">
                    Save Changes
                  </Button>
                  <Button variant="outline" data-testid="button-cancel-profile">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="store" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Store Configuration</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    defaultValue="LUXE"
                    data-testid="input-store-name"
                  />
                </div>

                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    defaultValue="Your destination for premium products and exceptional service."
                    rows={4}
                    data-testid="textarea-store-description"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeEmail">Contact Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      defaultValue="support@luxe.com"
                      data-testid="input-store-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storePhone">Contact Phone</Label>
                    <Input
                      id="storePhone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      data-testid="input-store-phone"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    defaultValue="123 Luxury Avenue, New York, NY 10001"
                    rows={3}
                    data-testid="textarea-store-address"
                  />
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-semibold">Shipping Settings</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Free Shipping Threshold</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimum order value for free shipping
                      </p>
                    </div>
                    <Input
                      type="number"
                      defaultValue="100"
                      className="w-32"
                      data-testid="input-shipping-threshold"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button data-testid="button-save-store">
                    Save Changes
                  </Button>
                  <Button variant="outline" data-testid="button-cancel-store">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Light</span>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={toggleTheme}
                      data-testid="switch-theme"
                    />
                    <span className="text-sm">Dark</span>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Label className="mb-4 block">Preview</Label>
                  <div className="border rounded-lg p-8 bg-card">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Button data-testid="button-preview-primary">
                          Primary Button
                        </Button>
                        <Button variant="outline" data-testid="button-preview-outline">
                          Outline Button
                        </Button>
                        <Button variant="secondary" data-testid="button-preview-secondary">
                          Secondary Button
                        </Button>
                      </div>
                      <Card className="p-4">
                        <h3 className="font-semibold mb-2">Sample Card</h3>
                        <p className="text-sm text-muted-foreground">
                          This is a preview of how cards will look with your
                          current theme settings.
                        </p>
                      </Card>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button data-testid="button-save-appearance">
                    Save Changes
                  </Button>
                  <Button variant="outline" data-testid="button-cancel-appearance">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
