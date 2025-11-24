import { useState, useEffect } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Shipping", "Payment", "Review"];

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        order: {
          customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          customerEmail: shippingInfo.email,
          customerPhone: shippingInfo.phone,
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          shippingZip: shippingInfo.zip,
          subtotal: subtotal.toString(),
          shipping: shipping.toString(),
          tax: tax.toString(),
          total: total.toString(),
        },
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
      };

      const response = await apiRequest("POST", "/api/orders", payload);
      return response.json();
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed. Check your email for details.",
      });
      navigate("/account");
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = () => {
    createOrderMutation.mutate();
  };

  if (authLoading) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StorefrontHeader />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              Your cart is empty
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-checkout-title">
          Checkout
        </h1>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      index + 1 <= currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                    data-testid={`step-indicator-${index + 1}`}
                  >
                    {index + 1 < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-sm mt-2">{step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index + 1 < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      data-testid="input-address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        data-testid="input-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        value={shippingInfo.zip}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                        data-testid="input-zip"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <RadioGroup defaultValue="card" className="space-y-4">
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem
                      value="card"
                      id="card"
                      data-testid="radio-card"
                    />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem
                      value="paypal"
                      id="paypal"
                      data-testid="radio-paypal"
                    />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      data-testid="input-card-number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      data-testid="input-card-name"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        data-testid="input-expiry"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Review Order</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-muted-foreground">
                      John Doe
                      <br />
                      123 Main St
                      <br />
                      New York, NY 10001
                      <br />
                      john@example.com
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-muted-foreground">
                      Credit Card ending in 3456
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" data-testid="checkbox-terms" />
                    <Label htmlFor="terms" className="cursor-pointer text-sm">
                      I agree to the terms and conditions and privacy policy
                    </Label>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  data-testid="button-continue"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={createOrderMutation.isPending}
                  data-testid="button-place-order"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-summary-subtotal">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span data-testid="text-summary-shipping">
                    {shipping === 0
                      ? "Free"
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span data-testid="text-summary-tax">
                    ${tax.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span data-testid="text-summary-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Secure checkout</p>
                <p>• Free shipping on orders over $100</p>
                <p>• 30-day return policy</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
