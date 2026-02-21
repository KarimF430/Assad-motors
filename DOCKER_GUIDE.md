# 🐳 Docker Setup Guide - Motor Octane

Complete Docker setup for running Motor Octane on any machine.

## 📋 Prerequisites

- Docker Desktop (Mac/Windows) or Docker Engine (Linux)
- Docker Compose v2.0+
- 4GB+ RAM available
- 10GB+ disk space

## 🚀 Quick Start (Development)

### 1. Clone and Setup

```bash
git clone https://github.com/KarimF430/Killer-Whale.git
cd Killer-Whale
```

### 2. Start Everything

```bash
# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

---

## 📦 What's Included

### Development Stack (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| **Frontend** | 3000 | Next.js with hot reload |
| **Backend** | 5001 | Express API with hot reload |
| **MongoDB** | 27017 | Database |
| **Redis** | 6379 | Cache & sessions |

### Production Stack (`docker-compose.prod.yml`)

- Optimized builds
- Multi-stage Dockerfiles
- Health checks
- Non-root users
- Minimal image sizes

---

## 🛠️ Common Commands

### Development

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Access container shell
docker exec -it gadizone-backend sh
docker exec -it gadizone-frontend sh

# Access MongoDB shell
docker exec -it gadizone-mongodb mongosh -u admin -p gadizone_dev_password

# Access Redis CLI
docker exec -it gadizone-redis redis-cli
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production
docker-compose -f docker-compose.prod.yml down
```

---

## ⚙️ Configuration

### Environment Variables

**Development:** Edit `docker-compose.yml` directly

**Production:** Create environment files:

```bash
# Backend production env
cp backend/.env.example backend/.env.production

# Frontend production env
cp .env.example .env.production
```

### MongoDB Credentials

**Development (default):**
- Username: `admin`
- Password: `gadizone_dev_password`
- Database: `gadizone`

**Connection String:**
```
mongodb://admin:gadizone_dev_password@localhost:27017/gadizone?authSource=admin
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a --volumes

# Remove specific volumes
docker volume rm gadizone_mongodb_data
```

---

## 📊 Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Should show "healthy" status
```

---

## 🔒 Security Notes

### Development

- Default passwords are for development only
- MongoDB and Redis are exposed on localhost
- Not suitable for production use

### Production

- Use strong passwords
- Don't expose MongoDB/Redis ports
- Use external managed databases (MongoDB Atlas, Upstash Redis)
- Enable SSL/TLS
- Use secrets management

---

## 📈 Performance Tips

### Development

```bash
# Allocate more resources in Docker Desktop
# Settings → Resources → Advanced
# - CPUs: 4+
# - Memory: 4GB+
# - Swap: 1GB+
```

### Production

```bash
# Use production builds
docker-compose -f docker-compose.prod.yml up -d

# Monitor resource usage
docker stats
```

---

## 🚢 Deployment

### Deploy to Any Server

```bash
# 1. Copy files to server
scp -r . user@server:/app

# 2. SSH into server
ssh user@server

# 3. Start production stack
cd /app
docker-compose -f docker-compose.prod.yml up -d
```

### Deploy with External Database

Edit `docker-compose.prod.yml` and add:

```yaml
environment:
  MONGODB_URI: mongodb+srv://user:pass@cluster.mongodb.net/gadizone
  REDIS_URL: redis://username:password@redis-host:6379
```

---

## 📝 File Structure

```
.
├── Dockerfile                    # Frontend production
├── Dockerfile.dev                # Frontend development
├── docker-compose.yml            # Development stack
├── docker-compose.prod.yml       # Production stack
├── .dockerignore                 # Exclude files from builds
├── backend/
│   ├── Dockerfile                # Backend production
│   └── Dockerfile.dev            # Backend development
└── DOCKER_GUIDE.md              # This file
```

---

## 🎯 Next Steps

1. ✅ Start development environment
2. ✅ Access http://localhost:3000
3. ✅ Make code changes (auto-reload)
4. ✅ Test with MongoDB and Redis
5. ✅ Build production images
6. ✅ Deploy to server

---

## 💡 Tips

- Use `docker-compose up -d` to run in background
- Use `docker-compose logs -f` to follow logs
- Use `docker-compose down -v` for clean restart
- Use `docker system prune` to free disk space
- Check `docker stats` for resource usage

---

## 🆘 Support

**Issues?**
- Check logs: `docker-compose logs -f`
- Rebuild: `docker-compose up -d --build`
- Clean start: `docker-compose down -v && docker-compose up -d`

**Still stuck?**
- Check Docker Desktop is running
- Ensure ports 3000, 5001, 27017, 6379 are free
- Verify Docker has enough resources allocated

---

**Happy Dockering! 🐳**
