import { ProductCard } from "../ProductCard";
import headphonesImage from "@assets/generated_images/premium_headphones_product_image.png";

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        name="Premium Wireless Headphones"
        price={299.99}
        originalPrice={399.99}
        image={headphonesImage}
        rating={4.5}
        reviewCount={128}
        onSale={true}
      />
    </div>
  );
}
