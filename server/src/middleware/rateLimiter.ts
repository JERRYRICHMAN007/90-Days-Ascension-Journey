import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

// Store to track rate limit violations per IP
const violationStore = new Map<string, { count: number; lastViolation: number }>();

// Cleanup old entries periodically (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, value] of violationStore.entries()) {
    if (value.lastViolation < oneHourAgo) {
      violationStore.delete(key);
    }
  }
}, 15 * 60 * 1000); // Clean up every 15 minutes

// First violation: 5 minutes
const firstViolationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Track violation
    const violation = violationStore.get(ip) || { count: 0, lastViolation: 0 };
    violation.count += 1;
    violation.lastViolation = Date.now();
    violationStore.set(ip, violation);
    
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please wait 5 minutes before trying again.',
      },
    });
  },
});

// Subsequent violations: 15 minutes
const repeatViolationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
      },
    });
  },
});

// Tiered rate limiter: uses 5 min for first violation, 15 min for repeat violations
export const authRateLimiter: RateLimitRequestHandler = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const violation = violationStore.get(ip);
  
  // If user has violated before, use stricter limiter (15 min)
  if (violation && violation.count > 0) {
    return repeatViolationLimiter(req, res, next);
  }
  
  // First time: use lenient limiter (5 min)
  return firstViolationLimiter(req, res, next);
};

// Clear violation count on successful authentication (call this from auth routes after successful login)
export const clearAuthViolations = (req: any) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  violationStore.delete(ip);
};

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

