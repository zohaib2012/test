import { useState, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const { data: allProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    return allProducts.filter((product) => {
      const price = parseFloat(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryId);
      const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-desc":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return parseFloat(b.rating) - parseFloat(a.rating);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [allProducts, priceRange, selectedCategories, searchQuery, sortBy]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setSearchQuery("");
  };

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
              Showing {filteredProducts.length} products
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
            <Select value={sortBy} onValueChange={setSortBy}>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-product-search"
                />
              </div>

              {/* Categories */}
              <div>
                <Label className="mb-3 block font-semibold">Categories</Label>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))
                  ) : (
                    categories?.map((category) => (
                      <div key={category.id} className="flex items-center gap-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                          data-testid={`checkbox-category-${category.name.toLowerCase()}`}
                        />
                        <Label
                          htmlFor={category.id}
                          className="cursor-pointer font-normal"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))
                  )}
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
                onClick={clearFilters}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
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
