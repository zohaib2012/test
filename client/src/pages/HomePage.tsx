import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, Shield, Headphones, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";
import heroImage from "@assets/generated_images/luxury_watch_hero_image.png";
import sneakersImage from "@assets/generated_images/sneakers_product_image.png";

export default function HomePage() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const trendingProducts = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              data-testid="text-hero-title"
            >
              Discover Luxury Redefined
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Premium products curated for those who demand excellence
            </p>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="text-lg" data-testid="button-shop-now">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop?sale=true">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30"
                  data-testid="button-view-deals"
                >
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-categories-title">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))
            ) : (
              categories?.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  image={category.id}
                  productCount={category.productCount}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold" data-testid="text-trending-title">
              Trending Now
            </h2>
            <Link href="/shop">
              <Button variant="ghost" data-testid="button-view-all">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={parseFloat(product.price)}
                  originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                  image={product.image}
                  rating={parseFloat(product.rating)}
                  reviewCount={product.reviewCount}
                  onSale={!!product.originalPrice}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card p-8 md:p-12 rounded-lg border border-card-border">
            <div>
              <h2 className="text-4xl font-bold mb-4" data-testid="text-offer-title">
                Limited Time Offer
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Get up to 40% off on selected premium items. Don't miss out!
              </p>
              <Link href="/shop?sale=true">
                <Button size="lg" data-testid="button-shop-sale">
                  Shop Sale
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={sneakersImage}
                alt="Special Offer"
                className="w-full h-full object-cover"
                data-testid="img-offer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">
                On orders over $100
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">
                100% secure transactions
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Dedicated customer service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">LUXE</div>
              <p className="text-muted-foreground">
                Your destination for premium products and exceptional service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Electronics</li>
                <li>Fashion</li>
                <li>Accessories</li>
                <li>Sale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Contact Us</li>
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 LUXE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
