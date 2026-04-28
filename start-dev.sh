#!/bin/bash

# Script para iniciar todos os micro-frontends em desenvolvimento
# Cada MFE roda independentemente, mas são iniciados em paralelo

set -e

echo "🚀 Iniciando ambiente de desenvolvimento (micro-frontends)..."
echo ""

# Função para matar processos nas portas específicas (se estiverem ocupadas)
free_ports() {
  echo "🧹 Liberando portas..."
  for port in 6280 6281 6282 6283 6284; do
    lsof -ti tcp:$port 2>/dev/null | xargs kill -9 2>/dev/null || true
  done
  sleep 1
}

# Verificar se concurrently está instalado
check_concurrently() {
  if ! command -v concurrently &> /dev/null; then
    echo "⚠️  concurrently não encontrado. Instalando..."
    yarn global add concurrently
  fi
}

# Menu de opções
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo "Uso: ./start-dev.sh [opção]"
  echo ""
  echo "Opções:"
  echo "  --fresh, -f    Libera as portas antes de iniciar"
  echo "  --help, -h     Mostra esta ajuda"
  echo ""
  echo "Este script inicia todos os MFEs em paralelo:"
  echo "  - root-config (porta 6280)"
  echo "  - mfe-login (porta 6281)"
  echo "  - mfe-admin (porta 6282)"
  echo "  - mfe-student (porta 6283)"
  echo "  - mfe-style-guide (porta 6284)"
  echo ""
  echo "Acesse o aplicativo em: http://localhost:6280"
  exit 0
fi

if [ "$1" == "--fresh" ] || [ "$1" == "-f" ]; then
  free_ports
fi

check_concurrently

echo "📦 Iniciando micro-frontends..."
echo ""

# Usar concurrently para rodar todos em paralelo com labels coloridos
concurrently \
  --prefix "[{name}]" \
  --names "root,login,admin,student,style" \
  --prefix-colors "blue,green,yellow,magenta,cyan" \
  --kill-others \
  "cd root-config && yarn dev" \
  "cd mfe-login && yarn dev" \
  "cd mfe-admin && yarn dev" \
  "cd mfe-student && yarn dev" \
  "cd mfe-style-guide && yarn dev"
