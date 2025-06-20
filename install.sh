#!/bin/bash

# Simple install script for Ubuntu CLI to setup and run the Next.js app

echo "Starting installation script..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js could not be found. Please install Node.js and npm first."
    echo "Refer to https://nodejs.org/en/download/package-manager/ for installation instructions."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm could not be found. Please install npm first."
    exit 1
fi

echo "Node.js and npm found."

# Install dependencies
echo "Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "npm install failed. Please check the errors above."
    exit 1
fi

echo "Dependencies installed successfully."

# Run the development server
echo "Starting the development server..."
npm run dev
