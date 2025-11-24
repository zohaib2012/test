import { StorefrontHeader } from "@/components/StorefrontHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, subtotal } = useCart();

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-cart-title">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground mb-6">
              Your cart is empty
            </p>
            <Link href="/shop">
              <Button data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-lg mb-2"
                        data-testid={`text-cart-item-name-${item.id}`}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-xl font-bold text-primary mb-4"
                        data-testid={`text-cart-item-price-${item.id}`}
                      >
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className="px-6 font-semibold"
                            data-testid={`text-quantity-${item.id}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-xl font-bold"
                        data-testid={`text-cart-item-total-${item.id}`}
                      >
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="text-subtotal">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span data-testid="text-shipping">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span data-testid="text-tax">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
                  </div>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <Link href="/checkout">
                  <Button
                    size="lg"
                    className="w-full"
                    data-testid="button-checkout"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mt-3"
                    data-testid="button-continue-shopping"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
