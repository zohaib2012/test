import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export function CategoryCard({
  id,
  name,
  image,
  productCount,
}: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${id}`} data-testid={`link-category-${id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-category-${id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3
              className="text-2xl font-bold mb-1"
              data-testid={`text-category-name-${id}`}
            >
              {name}
            </h3>
            <p
              className="text-sm text-white/90"
              data-testid={`text-product-count-${id}`}
            >
              {productCount} products
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
