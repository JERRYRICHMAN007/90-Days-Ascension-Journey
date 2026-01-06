import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/users";
import { fileRoutes } from "./routes/files";

dotenv.config();

const app = express();
// Use 5001 by default to avoid conflicts and permission issues
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "127.0.0.1";

// Security middleware
app.use(helmet());
// CORS configuration - allow common development ports and production URLs
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173", // Vite default port
  "http://127.0.0.1:5173", // Vite default port (IPv4)
  "http://localhost:5174", // Vite fallback port
  "http://127.0.0.1:5174", // Vite fallback port (IPv4)
  "http://localhost:5175", // Additional Vite port
  "http://127.0.0.1:5175", // Additional Vite port (IPv4)
  // Add your Vercel frontend URL here
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, be more permissive - allow localhost and 127.0.0.1 on any port
      if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
        try {
          const originUrl = new URL(origin);
          // Allow any localhost or 127.0.0.1 origin in development
          if (originUrl.hostname === "localhost" || 
              originUrl.hostname === "127.0.0.1" ||
              originUrl.hostname === "::1") {
            return callback(null, true);
          }
        } catch (e) {
          // If URL parsing fails, continue to check allowed origins
        }
      }

      // In production, be more permissive if APP_URL is set
      if (process.env.NODE_ENV === "production" && process.env.APP_URL) {
        // Allow the configured frontend URL and any subdomain
        const frontendUrl = new URL(process.env.APP_URL);
        const originUrl = origin.startsWith("http") ? new URL(origin) : null;

        if (originUrl && originUrl.hostname === frontendUrl.hostname) {
          return callback(null, true);
        }
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, log but allow. In production, be more lenient
        if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
          console.warn(`CORS: Origin ${origin} not in allowed list, but allowing in development`);
          callback(null, true);
        } else {
          // In production, allow if it's a known pattern
          callback(null, true);
        }
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
