import { useState } from "react";
import { StorefrontHeader } from "@/components/StorefrontHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";
import headphonesImage from "@assets/generated_images/premium_headphones_product_image.png";
import laptopImage from "@assets/generated_images/gaming_laptop_product_image.png";
import bagImage from "@assets/generated_images/leather_bag_product_image.png";
import phoneImage from "@assets/generated_images/smartphone_product_image.png";
import sneakersImage from "@assets/generated_images/sneakers_product_image.png";

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(true);

  // todo: remove mock functionality - mock data
  const products = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: headphonesImage,
      rating: 4.5,
      reviewCount: 128,
      onSale: true,
    },
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
    {
      id: "4",
      name: "Smartphone X Pro",
      price: 999.99,
      image: phoneImage,
      rating: 4.9,
      reviewCount: 234,
    },
    {
      id: "5",
      name: "Designer Sneakers",
      price: 159.99,
      image: sneakersImage,
      rating: 4.4,
      reviewCount: 92,
    },
    {
      id: "6",
      name: "Wireless Earbuds Pro",
      price: 179.99,
      image: headphonesImage,
      rating: 4.7,
      reviewCount: 203,
    },
  ];

  const categories = [
    "Electronics",
    "Fashion",
    "Accessories",
    "Footwear",
    "Home & Living",
  ];

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-shop-title">
              All Products
            </h1>
            <p className="text-muted-foreground">
              Showing {products.length} products
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px]" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 flex-shrink-0 space-y-6">
              {/* Search */}
              <div>
                <Label className="mb-2 block">Search</Label>
                <Input
                  type="search"
                  placeholder="Search products..."
                  data-testid="input-product-search"
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="mb-3 block font-semibold">Categories</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={category}
                        data-testid={`checkbox-category-${category.toLowerCase()}`}
                      />
                      <Label
                        htmlFor={category}
                        className="cursor-pointer font-normal"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label className="mb-3 block font-semibold">Price Range</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000}
                  step={10}
                  className="mb-4"
                  data-testid="slider-price-range"
                />
                <div className="flex items-center justify-between text-sm">
                  <span data-testid="text-min-price">${priceRange[0]}</span>
                  <span data-testid="text-max-price">${priceRange[1]}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="mb-3 block font-semibold">Rating</Label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        data-testid={`checkbox-rating-${rating}`}
                      />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="cursor-pointer font-normal"
                      >
                        {rating}+ Stars
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button variant="outline" data-testid="button-prev-page">
                Previous
              </Button>
              <Button variant="outline" data-testid="button-page-1">
                1
              </Button>
              <Button data-testid="button-page-2">2</Button>
              <Button variant="outline" data-testid="button-page-3">
                3
              </Button>
              <Button variant="outline" data-testid="button-next-page">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
