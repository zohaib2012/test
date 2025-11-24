import { storage } from "./storage";
import type { InsertCategory, InsertProduct, InsertUser } from "@shared/schema";

async function seed() {
  console.log("Starting database seed...");

  // Create admin user
  try {
    const adminUser: InsertUser = {
      email: "admin@luxe.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    };

    const existingAdmin = await storage.getUserByEmail(adminUser.email);
    if (!existingAdmin) {
      await storage.createUser(adminUser);
      console.log("✓ Admin user created");
    } else {
      console.log("✓ Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }

  // Create categories
  const categories: InsertCategory[] = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Accessories", slug: "accessories" },
    { name: "Footwear", slug: "footwear" },
  ];

  const createdCategories = [];
  for (const category of categories) {
    try {
      const existing = await storage.getAllCategories();
      const found = existing.find(c => c.slug === category.slug);
      
      if (!found) {
        const created = await storage.createCategory(category);
        createdCategories.push(created);
        console.log(`✓ Category created: ${category.name}`);
      } else {
        createdCategories.push(found);
        console.log(`✓ Category exists: ${category.name}`);
      }
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error);
    }
  }

  // Create products
  const products: Omit<InsertProduct, "categoryId">[] = [
    {
      name: "Premium Wireless Headphones",
      description: "Experience premium sound quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium materials for ultimate comfort.",
      price: "299.99",
      originalPrice: "399.99",
      stock: 45,
      image: "/assets/generated_images/premium_headphones_product_image.png",
      rating: "4.5",
      reviewCount: 128,
      status: "active",
    },
    {
      name: "Gaming Laptop Pro",
      description: "High-performance gaming laptop with RTX 4070, 32GB RAM, and 1TB SSD. Perfect for gaming and content creation.",
      price: "1299.99",
      stock: 12,
      image: "/assets/generated_images/gaming_laptop_product_image.png",
      rating: "4.8",
      reviewCount: 89,
      status: "active",
    },
    {
      name: "Luxury Leather Bag",
      description: "Handcrafted leather bag with premium materials. Perfect for business or casual use.",
      price: "199.99",
      stock: 28,
      image: "/assets/generated_images/leather_bag_product_image.png",
      rating: "4.6",
      reviewCount: 156,
      status: "active",
    },
    {
      name: "Smartphone X Pro",
      description: "Latest flagship smartphone with 5G, triple camera system, and all-day battery life.",
      price: "999.99",
      stock: 35,
      image: "/assets/generated_images/smartphone_product_image.png",
      rating: "4.9",
      reviewCount: 234,
      status: "active",
    },
    {
      name: "Designer Sneakers",
      description: "Premium sneakers with superior comfort and style. Perfect for everyday wear.",
      price: "159.99",
      stock: 52,
      image: "/assets/generated_images/sneakers_product_image.png",
      rating: "4.4",
      reviewCount: 92,
      status: "active",
    },
    {
      name: "Wireless Earbuds Pro",
      description: "True wireless earbuds with active noise cancellation and premium sound quality.",
      price: "179.99",
      stock: 68,
      image: "/assets/generated_images/premium_headphones_product_image.png",
      rating: "4.7",
      reviewCount: 203,
      status: "active",
    },
  ];

  // Map products to categories
  const productCategoryMap = [
    { product: 0, category: 0 }, // Headphones -> Electronics
    { product: 1, category: 0 }, // Laptop -> Electronics
    { product: 2, category: 1 }, // Bag -> Fashion
    { product: 3, category: 0 }, // Phone -> Electronics
    { product: 4, category: 3 }, // Sneakers -> Footwear
    { product: 5, category: 2 }, // Earbuds -> Accessories
  ];

  for (const mapping of productCategoryMap) {
    const product = products[mapping.product];
    const category = createdCategories[mapping.category];
    
    if (!category) continue;

    try {
      const existing = await storage.getAllProducts();
      const found = existing.find(p => p.name === product.name);
      
      if (!found) {
        await storage.createProduct({
          ...product,
          categoryId: category.id,
        });
        console.log(`✓ Product created: ${product.name}`);
      } else {
        console.log(`✓ Product exists: ${product.name}`);
      }
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }

  console.log("✓ Database seeding complete!");
}

seed().catch(console.error);
