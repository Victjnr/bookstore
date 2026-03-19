#!/bin/bash

# CORS Testing Script
# Tests preflight and actual requests with proper CORS handling

echo "=== CORS Health Check ==="
echo ""

# Test 1: Preflight OPTIONS request
echo "Test 1: Preflight OPTIONS Request"
echo "Command: curl -i -X OPTIONS http://localhost:8000/api/cart -H 'Origin: http://localhost:8080' -H 'Access-Control-Request-Method: GET'"
echo ""

curl -i -X OPTIONS http://localhost:8000/api/cart \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type"

echo ""
echo ""

# Test 2: Check for CORS headers in response
echo "Test 2: Check CORS Headers in Regular GET Request"
echo "Command: curl -i http://localhost:8000/api/cart -H 'Origin: http://localhost:8080' -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""

# Note: This requires a valid token, so just show the command
echo "(Requires authentication token)"

echo ""
echo ""

# Test 3: Test login endpoint
echo "Test 3: POST to Login Endpoint (preflight + actual)"
echo "Command: curl -i -X POST http://localhost:8000/auth/login -H 'Origin: http://localhost:8080' -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password\"}'"
echo ""

curl -i -X POST http://localhost:8000/auth/login \
  -H "Origin: http://localhost:8080" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

echo ""
echo ""
echo "=== Expected CORS Headers ==="
echo "✅ Access-Control-Allow-Origin: http://localhost:8080"
echo "✅ Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH"
echo "✅ Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept"
echo "✅ Access-Control-Allow-Credentials: true"
echo "✅ Access-Control-Max-Age: 3600"
