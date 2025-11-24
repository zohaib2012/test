import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const relatedProducts = allProducts
    ?.filter((p) => p.id !== productId && p.categoryId === product?.categoryId)
    .slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
    }, quantity);

    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {productLoading ? (
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : !product ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Product not found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-main"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <Badge className="mb-4">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Badge>
                  <h1
                    className="text-3xl md:text-4xl font-bold mb-4"
                    data-testid="text-product-name"
                  >
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(parseFloat(product.rating))
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className="text-muted-foreground"
                      data-testid="text-reviews"
                    >
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="text-4xl font-bold"
                      data-testid="text-product-price"
                    >
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through">
                        ${parseFloat(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground">
                  {product.description}
                </p>

            {/* Quantity */}
            <div>
              <Label className="mb-3 block font-semibold">Quantity</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span
                    className="px-6 font-semibold"
                    data-testid="text-quantity"
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-add-to-wishlist"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  data-testid="button-buy-now"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description" data-testid="tab-description">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" data-testid="tab-specifications">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6 space-y-4">
            <h3 className="text-xl font-semibold">Product Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our Premium Wireless Headphones deliver exceptional audio quality
              with deep bass and crystal-clear highs. The advanced active noise
              cancellation technology blocks out distractions, while the
              comfortable over-ear design ensures hours of listening pleasure.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Active Noise Cancellation (ANC)</li>
              <li>30-hour battery life with ANC on</li>
              <li>Premium leather ear cushions</li>
              <li>Multi-device connectivity</li>
              <li>Quick charge: 10 min = 5 hours playback</li>
            </ul>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Driver Size:</span>
                <span>40mm</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Frequency Response:</span>
                <span>20Hz - 20kHz</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Bluetooth Version:</span>
                <span>5.0</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Weight:</span>
                <span>250g</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-6">
            <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
            <div className="space-y-6">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-6 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-primary text-primary"
                        />
                      ))}
                    </div>
                    <span className="font-semibold">John Doe</span>
                    <span className="text-sm text-muted-foreground">
                      · 2 days ago
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    Excellent product! The sound quality is amazing and the
                    battery life exceeds expectations.
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
            </Tabs>

            {/* Related Products */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-related-title">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    price={parseFloat(relatedProduct.price)}
                    originalPrice={relatedProduct.originalPrice ? parseFloat(relatedProduct.originalPrice) : undefined}
                    image={relatedProduct.image}
                    rating={parseFloat(relatedProduct.rating)}
                    reviewCount={relatedProduct.reviewCount}
                    onSale={!!relatedProduct.originalPrice}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function Label({ children, className, ...props }: any) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
}
