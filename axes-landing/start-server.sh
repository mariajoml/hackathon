#!/bin/bash
echo "=== VERIFICANDO DIRECTORIO ==="
pwd
echo ""

echo "=== VERIFICANDO PACKAGE.JSON ==="
ls -la package.json
echo ""

echo "=== VERIFICANDO NODE_MODULES ==="
ls -la node_modules | head -5
echo ""

echo "=== VERIFICANDO ESTRUCTURA SRC ==="
ls -la src/
echo ""

echo "=== INICIANDO SERVIDOR ==="
npx next dev --port 3000
