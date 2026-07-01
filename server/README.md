# Forge90 Backend API

Backend API for the Forge90 application with authentication, file uploads, and user management.

## Tech Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3 (or S3-compatible like MinIO)
- **Email**: SendGrid
- **Authentication**: JWT (access + refresh tokens)
- **Password Hashing**: Argon2

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local development)
- PostgreSQL (or use Docker)
- AWS S3 account (or MinIO for local dev)

### Local Development with Docker

1. **Clone and setup**:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

2. **Start services**:
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- MinIO (S3-compatible) on port 9000
- Adminer (DB admin) on port 8080
- Backend API on port 4000

3. **Run migrations**:
```bash
npm install
npx prisma migrate dev
npx prisma generate
```

4. **Seed database**:
```bash
npm run prisma:seed
```

5. **Start development server**:
```bash
npm run dev
```

### Manual Setup (without Docker)

1. **Install dependencies**:
```bash
npm install
```

2. **Setup PostgreSQL**:
```bash
# Create database
createdb ascension

# Or use psql
psql -U postgres
CREATE DATABASE ascension;
```

3. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your database URL and secrets
```

4. **Run migrations**:
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Seed database**:
```bash
npm run prisma:seed
```

6. **Start server**:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET`: Secret for refresh tokens (min 32 chars)
- `S3_*`: S3 configuration
- `MAIL_API_KEY`: SendGrid API key

## API Endpoints

### Authentication

- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login
- `POST /v1/auth/refresh` - Refresh access token
- `POST /v1/auth/logout` - Logout (revoke refresh token)
- `POST /v1/auth/forgot-password` - Request password reset
- `POST /v1/auth/reset-password` - Reset password with token

### Users

- `GET /v1/users/me` - Get current user (auth required)
- `PATCH /v1/users/me` - Update current user (auth required)

### Files

- `POST /v1/files/presign` - Get presigned URL for upload (auth required)
- `POST /v1/files/confirm` - Confirm file upload and process (auth required)

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

## Database Management

```bash
# Open Prisma Studio
npm run prisma:studio

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Production Deployment

1. **Build**:
```bash
npm run build
```

2. **Run migrations**:
```bash
npx prisma migrate deploy
```

3. **Start**:
```bash
npm start
```

Or use Docker:
```bash
docker build -t ascension-backend .
docker run -p 4000:4000 --env-file .env ascension-backend
```

## Security Checklist

- [x] Password hashing with Argon2
- [x] JWT with short-lived access tokens
- [x] Refresh token rotation
- [x] Rate limiting on auth endpoints
- [x] Input validation
- [x] Secure password reset flow
- [x] File upload validation
- [ ] HTTPS only in production
- [ ] CORS configuration
- [ ] Security headers (Helmet)
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection

## MinIO Setup (Local S3)

1. Access MinIO console: http://localhost:9001
2. Login: `minioadmin` / `minioadmin`
3. Create bucket: `ascension-app`
4. Set bucket policy to public-read (for avatars)

## Troubleshooting

**Database connection errors**:
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check firewall/port access

**S3/MinIO errors**:
- Verify bucket exists
- Check credentials
- For MinIO, ensure `S3_FORCE_PATH_STYLE=true`

**Migration errors**:
- Run `npx prisma generate` first
- Check database permissions
- Verify schema.prisma is correct

