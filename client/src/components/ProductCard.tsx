import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  image: string;
  rating: number;
  reviewCount: number;
  onSale?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  onSale,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price: Number(price),
      image,
    });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/product/${id}`} data-testid={`link-product-${id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
          {onSale && (
            <Badge
              className="absolute top-2 right-2"
              data-testid={`badge-sale-${id}`}
            >
              Sale
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          <Button
            size="icon"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${id}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <h3
            className="font-semibold text-lg line-clamp-2 mb-2"
            data-testid={`text-product-name-${id}`}
          >
            {name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            ))}
            <span
              className="text-sm text-muted-foreground ml-1"
              data-testid={`text-review-count-${id}`}
            >
              ({reviewCount})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              data-testid={`text-price-${id}`}
            >
              ${Number(price).toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${Number(originalPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
