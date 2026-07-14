import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { fileRoutes } from "./routes/files";
import { progressRoutes } from "./routes/progress";
import { taskRoutes } from "./routes/tasks";
import { gamificationRoutes } from "./routes/gamification";
import { achievementRoutes } from "./routes/achievements";

dotenv.config();

const app = express();
// Use 5001 by default to avoid conflicts and permission issues
// In production, listen on 0.0.0.0 to accept connections from any interface
const PORT = process.env.PORT || 5001;
const HOST = process.env.NODE_ENV === "production" 
  ? (process.env.HOST || "0.0.0.0")
  : (process.env.HOST || "127.0.0.1");

// Security middleware
app.use(helmet());

const devOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean)
  : [];

const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const allowedOrigins = isDevelopment
  ? [...new Set([...devOrigins, ...envOrigins, process.env.APP_URL, process.env.FRONTEND_URL].filter(Boolean) as string[])]
  : envOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      const normalized = origin?.replace(/\/$/, "") || "";
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(normalized)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Supabase connection test endpoint
app.get("/v1/health/supabase", async (req, res) => {
  try {
    const { supabaseAdmin } = await import('./lib/supabase');
    
    // Test Supabase Auth connection
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    if (authError) {
      return res.status(503).json({
        status: "error",
        service: "supabase",
        error: authError.message,
        timestamp: new Date().toISOString()
      });
    }
    
    // Test database connection (if Prisma is configured)
    let dbStatus = "not_configured";
    try {
      const { prisma } = await import('./prisma/client');
      await prisma.$connect();
      // Simple query to verify connection
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      dbStatus = "connected";
    } catch (dbError: any) {
      dbStatus = dbError.message || "connection_failed";
      console.error('Database connection test error:', dbError.message);
    }
    
    res.json({
      status: "ok",
      services: {
        supabase_auth: "connected",
        database: dbStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(503).json({
      status: "error",
      service: "supabase",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
});

// API routes
app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/files", fileRoutes);
app.use("/v1/progress", progressRoutes);
app.use("/v1/tasks", taskRoutes);
app.use("/v1", gamificationRoutes);
app.use("/v1/achievements", achievementRoutes);

// Production: serve built React app from client/dist (single deploy)
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/v1") ||
      req.path.startsWith("/health") ||
      req.path.includes(".")
    ) {
      return next();
    }
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

// Error handling
app.use(errorHandler);

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API Base: http://${HOST}:${PORT}/v1`);
  console.log(`🏥 Health Check: http://${HOST}:${PORT}/health`);
  console.log(`🔍 Supabase Test: http://${HOST}:${PORT}/v1/health/supabase`);
  
  // Test database connection on startup
  (async () => {
    try {
      const { prisma } = await import('./prisma/client');
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database (Prisma) connected successfully');
      await prisma.$disconnect();
    } catch (err: any) {
      console.error('❌ Database connection error:', err.message);
      if (err.message?.includes('Can\'t reach database server')) {
        console.error('   → Check your DATABASE_URL in .env file');
        console.error('   → Verify Supabase project is active in dashboard');
        console.error('   → URL should be: postgresql://postgres:PASSWORD@db.PROJECT-ID.supabase.co:5432/postgres');
      }
    }
  })();
});
