# Docker Setup for PwnDoc-ng

This document outlines the Docker setup for PwnDoc-ng after the migration from Quasar to Vue Shadcn with Vite.

## Overview

The application consists of four main services:
- **MongoDB**: Database service
- **Backend**: Node.js API server
- **Frontend**: Vue.js application with Vite
- **LanguageTool**: Grammar checking service

## Architecture

### Production Setup
- **Frontend**: Multi-stage build with Vite → Nginx serving static files
- **Backend**: Node.js API server with HTTPS
- **Database**: MongoDB with persistent storage
- **Proxy**: Nginx handles SSL termination and routing

### Development Setup
- **Frontend**: Vite dev server with hot reload + Nginx proxy
- **Backend**: Node.js with nodemon for hot reload
- **Database**: MongoDB with development data
- **Proxy**: Nginx for consistent routing

## Quick Start

### Development Environment
```bash
# Start development containers
docker-compose -f docker-compose-dev.yml up -d --build

# View logs
docker-compose -f docker-compose-dev.yml logs -f

# Stop containers
docker-compose -f docker-compose-dev.yml down

# Clean up (remove volumes)
docker-compose -f docker-compose-dev.yml down -v
```

### Production Environment
```bash
# Start production containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

## Services Configuration

### Frontend Service

#### Development
- **Container**: `pwndoc-ng-frontend-dev`
- **Port**: 8081 (Vite dev server)
- **Features**: Hot reload, TypeScript checking, fast refresh
- **Proxy**: Nginx proxy on port 8443

#### Production
- **Container**: `pwndoc-ng-frontend`
- **Port**: 8443 (Nginx HTTPS)
- **Features**: Optimized build, static file serving, SSL termination

### Backend Service

#### Development
- **Container**: `pwndoc-ng-backend-dev`
- **Port**: 5252 (API), 8440 (WebSocket)
- **Features**: Nodemon auto-restart, source code mounting

#### Production
- **Container**: `pwndoc-ng-backend`
- **Port**: 4242 (API), 8440 (WebSocket)
- **Features**: Optimized for production, minimal attack surface

### Database Service
- **Container**: `mongo-pwndoc-ng` (prod) / `mongo-pwndoc-ng-dev` (dev)
- **Port**: 27017 (localhost only)
- **Volumes**: Persistent storage for data

### LanguageTool Service
- **Container**: `pwndoc-ng-languagetool` (prod) / `pwndoc-ng-languagetool-dev` (dev)
- **Port**: 8010 (internal only)
- **Purpose**: Grammar and spell checking

## File Structure

```
pwndoc-ng/
├── docker-compose.yml              # Production configuration
├── docker-compose-dev.yml          # Development configuration
├── docker-test.sh                  # Testing script
├── frontend/
│   ├── Dockerfile                  # Production build
│   ├── Dockerfile.dev              # Development build
│   ├── .docker/
│   │   ├── nginx.conf              # Production nginx config
│   │   └── nginx.dev.conf          # Development nginx config
│   └── ssl/                        # SSL certificates
└── backend/
    ├── Dockerfile                  # Production build
    ├── Dockerfile.dev              # Development build
    └── ssl/                        # SSL certificates
```

## Environment Variables

### Backend
- `NODE_ENV`: Set to 'development' or 'production'
- `COLLAB_WEBSOCKET_PORT`: WebSocket port (default: 8440)
- `MONGO_DB`: Database name (default: pwndoc)

### Frontend
- `NODE_ENV`: Set to 'development' or 'production'
- No additional environment variables needed

## Networking

### Development
- **Frontend**: `https://localhost:8443` (Nginx proxy)
- **Backend API**: `https://localhost:8443/api` (proxied)
- **MongoDB**: `localhost:27017` (direct access)

### Production
- **Frontend**: `https://localhost:8443` (Nginx)
- **Backend API**: `https://localhost:8443/api` (proxied)
- **MongoDB**: `localhost:27017` (direct access)

## SSL Configuration

Both development and production use SSL certificates located in:
- `frontend/ssl/server.cert`
- `frontend/ssl/server.key`
- `backend/ssl/server.cert`
- `backend/ssl/server.key`

## Volume Mounts

### Development
Frontend volumes:
- `./frontend/src:/app/src` - Source code hot reload
- `./frontend/public:/app/public` - Public assets
- `./frontend/vite.config.ts:/app/vite.config.ts` - Vite configuration
- `./frontend/tailwind.config.js:/app/tailwind.config.js` - Tailwind configuration
- `./frontend/postcss.config.js:/app/postcss.config.js` - PostCSS configuration

Backend volumes:
- `./backend/src:/app/src` - Source code hot reload
- `./backend/report-templates:/app/report-templates` - Report templates
- `./backend/ssl:/app/ssl` - SSL certificates

### Production
- `./backend/report-templates:/app/report-templates` - Report templates
- `./backend/src/config:/app/src/config` - Configuration files

## Testing

Use the provided testing script to validate your setup:

```bash
# Test both development and production
./docker-test.sh

# Test only development
./docker-test.sh dev

# Test only production
./docker-test.sh prod

# Clean up Docker resources
./docker-test.sh cleanup
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 8443, 4242, 5252, 8081, and 27017 are available
2. **SSL certificates**: Ensure SSL certificates exist in the ssl/ directories
3. **File permissions**: Make sure docker-test.sh is executable (`chmod +x docker-test.sh`)
4. **Memory issues**: Ensure Docker has sufficient memory allocated (recommended: 4GB+)

### Logs

View logs for specific services:
```bash
# Development
docker-compose -f docker-compose-dev.yml logs frontend-app
docker-compose -f docker-compose-dev.yml logs backend

# Production
docker-compose logs frontend
docker-compose logs backend
```

### Clean Reset

If you encounter persistent issues:
```bash
# Stop all containers
docker-compose down -v
docker-compose -f docker-compose-dev.yml down -v

# Remove all PwnDoc-ng images
docker images | grep pwndoc-ng | awk '{print $3}' | xargs docker rmi

# Remove unused Docker resources
docker system prune -a -f

# Rebuild everything
docker-compose up -d --build
```

## Performance Optimization

### Development
- Use `.dockerignore` to exclude unnecessary files
- Mount only necessary directories
- Use multi-stage builds for faster rebuilds

### Production
- Multi-stage Docker builds reduce image size
- Nginx caching for static assets
- Security headers for better security score

## Security Considerations

- SSL/TLS encryption for all communication
- Nginx security headers
- Network isolation between services
- Non-root user in containers (where applicable)
- Minimal attack surface in production images

## Monitoring

Monitor your containers:
```bash
# Check container health
docker-compose ps

# Monitor resource usage
docker stats

# Check logs for errors
docker-compose logs | grep -i error
```

## Updates and Maintenance

### Updating Dependencies
1. Update `package.json` files
2. Rebuild containers: `docker-compose up -d --build`
3. Test with `./docker-test.sh`

### Database Migrations
- Development: Data is ephemeral, recreate as needed
- Production: Use proper migration scripts and backup data

### SSL Certificate Renewal
Replace certificates in ssl/ directories and restart containers.

## Support

For issues related to:
- **Docker setup**: Check this documentation and logs
- **Application bugs**: See main project README
- **Performance**: Monitor resource usage and logs
- **Security**: Review security headers and SSL configuration 