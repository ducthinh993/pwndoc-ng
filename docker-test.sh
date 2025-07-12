#!/bin/bash

# Docker Setup Testing Script for PwnDoc-ng
# This script tests both development and production Docker setups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== PwnDoc-ng Docker Setup Testing Script ===${NC}"

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Checking $service_name on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            echo -e "${GREEN}✓ $service_name is running on port $port${NC}"
            return 0
        fi
        echo -e "${YELLOW}Attempt $attempt/$max_attempts: $service_name not ready yet...${NC}"
        sleep 5
        ((attempt++))
    done
    
    echo -e "${RED}✗ $service_name failed to start on port $port${NC}"
    return 1
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -e "${YELLOW}Testing $description: $url${NC}"
    
    local status=$(curl -k -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ $description: HTTP $status${NC}"
        return 0
    else
        echo -e "${RED}✗ $description: Expected HTTP $expected_status, got $status${NC}"
        return 1
    fi
}

# Function to cleanup Docker resources
cleanup() {
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    docker-compose -f docker-compose-dev.yml down -v 2>/dev/null || true
    docker-compose down -v 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# Function to test development setup
test_development() {
    echo -e "${GREEN}=== Testing Development Setup ===${NC}"
    
    # Start development containers
    echo -e "${YELLOW}Starting development containers...${NC}"
    docker-compose -f docker-compose-dev.yml up -d --build
    
    # Wait for services to be ready
    echo -e "${YELLOW}Waiting for services to start...${NC}"
    sleep 10
    
    # Check if containers are running
    echo -e "${YELLOW}Checking container status...${NC}"
    docker-compose -f docker-compose-dev.yml ps
    
    # Test service availability
    check_service "MongoDB" 27017
    check_service "Backend" 5252
    check_service "Frontend Dev Server" 8081
    check_service "Frontend Proxy" 8443
    
    # Test endpoints
    test_endpoint "https://localhost:8443" "200" "Frontend main page"
    test_endpoint "https://localhost:8443/api/users/isFirst" "200" "Backend API"
    
    # Check logs for errors
    echo -e "${YELLOW}Checking for errors in logs...${NC}"
    if docker-compose -f docker-compose-dev.yml logs --tail=50 | grep -i "error\|fail\|exception" | grep -v "DeprecationWarning"; then
        echo -e "${RED}✗ Found errors in logs${NC}"
    else
        echo -e "${GREEN}✓ No critical errors found in logs${NC}"
    fi
    
    # Cleanup
    docker-compose -f docker-compose-dev.yml down -v
    
    echo -e "${GREEN}Development setup test completed${NC}"
}

# Function to test production setup
test_production() {
    echo -e "${GREEN}=== Testing Production Setup ===${NC}"
    
    # Build and start production containers
    echo -e "${YELLOW}Building and starting production containers...${NC}"
    docker-compose up -d --build
    
    # Wait for services to be ready
    echo -e "${YELLOW}Waiting for services to start...${NC}"
    sleep 15
    
    # Check if containers are running
    echo -e "${YELLOW}Checking container status...${NC}"
    docker-compose ps
    
    # Test service availability
    check_service "MongoDB" 27017
    check_service "Backend" 4242
    check_service "Frontend" 8443
    
    # Test endpoints
    test_endpoint "https://localhost:8443" "200" "Frontend main page"
    test_endpoint "https://localhost:8443/api/users/isFirst" "200" "Backend API"
    
    # Check logs for errors
    echo -e "${YELLOW}Checking for errors in logs...${NC}"
    if docker-compose logs --tail=50 | grep -i "error\|fail\|exception" | grep -v "DeprecationWarning"; then
        echo -e "${RED}✗ Found errors in logs${NC}"
    else
        echo -e "${GREEN}✓ No critical errors found in logs${NC}"
    fi
    
    # Test build artifacts
    echo -e "${YELLOW}Checking build artifacts...${NC}"
    if docker exec pwndoc-ng-frontend test -f /usr/share/nginx/html/index.html; then
        echo -e "${GREEN}✓ Frontend build artifacts found${NC}"
    else
        echo -e "${RED}✗ Frontend build artifacts missing${NC}"
    fi
    
    # Cleanup
    docker-compose down -v
    
    echo -e "${GREEN}Production setup test completed${NC}"
}

# Main execution
case "${1:-all}" in
    "dev")
        test_development
        ;;
    "prod")
        test_production
        ;;
    "all")
        test_development
        echo ""
        test_production
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo -e "${RED}Usage: $0 [dev|prod|all|cleanup]${NC}"
        echo "  dev     - Test development setup only"
        echo "  prod    - Test production setup only"
        echo "  all     - Test both setups (default)"
        echo "  cleanup - Clean up Docker resources"
        exit 1
        ;;
esac

echo -e "${GREEN}=== Docker Testing Complete ===${NC}" 