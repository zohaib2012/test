import { CategoryCard } from "../CategoryCard";
import laptopImage from "@assets/generated_images/gaming_laptop_product_image.png";

export default function CategoryCardExample() {
  return (
    <div className="max-w-sm">
      <CategoryCard
        id="electronics"
        name="Electronics"
        image={laptopImage}
        productCount={245}
      />
    </div>
  );
}
