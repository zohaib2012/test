import { db } from "./db";
import { 
  users, 
  categories, 
  products, 
  orders, 
  orderItems,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllCustomers(): Promise<User[]>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;

  // Analytics
  getTotalRevenue(): Promise<number>;
  getTotalOrders(): Promise<number>;
  getTotalCustomers(): Promise<number>;
}

export class DbStorage implements IStorage {
  // Users
  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async getAllCustomers(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt));
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    // Update category product count
    await db.update(categories)
      .set({ productCount: sql`${categories.productCount} + 1` })
      .where(eq(categories.id, product.categoryId));
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await this.getProductById(id);
    if (!product) return false;
    
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    
    if (result.length > 0) {
      // Update category product count
      await db.update(categories)
        .set({ productCount: sql`${categories.productCount} - 1` })
        .where(eq(categories.id, product.categoryId));
      return true;
    }
    return false;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    const createdOrder = result[0];
    
    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        ...item,
        orderId: createdOrder.id,
      });
      
      // Update product stock
      await db.update(products)
        .set({ stock: sql`${products.stock} - ${item.quantity}` })
        .where(eq(products.id, item.productId));
    }
    
    return createdOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  // Analytics
  async getTotalRevenue(): Promise<number> {
    const result = await db.select({
      total: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
    }).from(orders).where(eq(orders.status, "delivered"));
    return Number(result[0]?.total || 0);
  }

  async getTotalOrders(): Promise<number> {
    const result = await db.select({
      count: sql<number>`COUNT(*)`,
    }).from(orders);
    return Number(result[0]?.count || 0);
  }

  async getTotalCustomers(): Promise<number> {
    const result = await db.select({
      count: sql<number>`COUNT(*)`,
    }).from(users).where(eq(users.role, "user"));
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DbStorage();
