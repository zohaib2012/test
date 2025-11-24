import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateToken, 
  verifyPassword, 
  authenticateToken, 
  requireAdmin,
  type AuthRequest 
} from "./auth";
import { insertUserSchema, insertCategorySchema, insertProductSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const user = await storage.createUser(userData);
      const token = generateToken(user);

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        }, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = generateToken(user);

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        }, 
        token 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    res.json({ 
      id: req.user.id, 
      email: req.user.email, 
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role 
    });
  });

  // Category Routes (Public read, Admin write)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/categories", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Product Routes (Public read, Admin write)
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId } = req.query;
      
      const products = categoryId 
        ? await storage.getProductsByCategory(categoryId as string)
        : await storage.getAllProducts();
        
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Order Routes (Authenticated users)
  app.get("/api/orders", authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const orders = req.user.role === "admin"
        ? await storage.getAllOrders()
        : await storage.getOrdersByUserId(req.user.id);
        
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      // Check authorization
      if (req.user.role !== "admin" && order.userId !== req.user.id) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      const items = await storage.getOrderItems(order.id);
      res.json({ ...order, items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders", authenticateToken, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { order: orderData, items } = req.body;
      
      const orderToCreate = {
        ...orderData,
        userId: req.user.id,
      };

      const order = await storage.createOrder(orderToCreate, items);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/orders/:id/status", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Customer Routes (Admin only)
  app.get("/api/customers", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics Routes (Admin only)
  app.get("/api/analytics", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const [revenue, orders, customers, products] = await Promise.all([
        storage.getTotalRevenue(),
        storage.getTotalOrders(),
        storage.getTotalCustomers(),
        storage.getAllProducts(),
      ]);

      res.json({
        totalRevenue: revenue,
        totalOrders: orders,
        totalCustomers: customers,
        totalProducts: products.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
