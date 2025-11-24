import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import headphonesImage from "@assets/generated_images/premium_headphones_product_image.png";
import laptopImage from "@assets/generated_images/gaming_laptop_product_image.png";
import bagImage from "@assets/generated_images/leather_bag_product_image.png";

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");

  // todo: remove mock functionality - mock data
  const product = {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    images: [headphonesImage, laptopImage, bagImage],
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Gaming Laptop Pro",
      price: 1299.99,
      image: laptopImage,
      rating: 4.8,
      reviewCount: 89,
    },
    {
      id: "3",
      name: "Luxury Leather Bag",
      price: 199.99,
      image: bagImage,
      rating: 4.6,
      reviewCount: 156,
    },
  ];

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Black", "White", "Red", "Blue"];

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <span>Home</span>
          <span>/</span>
          <span>Electronics</span>
          <span>/</span>
          <span className="text-foreground">Headphones</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-colors"
                  data-testid={`button-thumbnail-${index}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-4">In Stock</Badge>
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
                        i < Math.floor(product.rating)
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
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-muted-foreground">
              Experience premium sound quality with our wireless headphones.
              Featuring active noise cancellation, 30-hour battery life, and
              premium materials for ultimate comfort.
            </p>

            {/* Size Selector */}
            <div>
              <Label className="mb-3 block font-semibold">Size</Label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <Label className="mb-3 block font-semibold">Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(color)}
                    data-testid={`button-color-${color}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

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
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
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
