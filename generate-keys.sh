#!/bin/bash

echo "Creating cert folder..."
if [ ! -d "cert" ]; then
  mkdir cert
fi

cd cert || exit

echo ""

# Generate private key if not exists
if [ -f "private.pem" ]; then
  echo "private.pem already exists. Skipping..."
else
  echo "Generating private key..."
  openssl genrsa -out private.pem 2048
fi

echo ""

# Generate public key if not exists
if [ -f "public.pem" ]; then
  echo "public.pem already exists. Skipping..."
else
  echo "Generating public key..."
  openssl rsa -in private.pem -pubout -out public.pem
fi

echo ""
echo "Done!"
echo "Keys location: $(pwd)"

read -p "Press Enter to continue..."

