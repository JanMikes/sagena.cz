#!/bin/sh
set -ea

# Always check for node_modules if package.json exists
if [ -f "package.json" ]; then

  if [ ! -d "node_modules" ] || [ ! "$(ls -qAL node_modules 2>/dev/null)" ]; then

    echo "Node modules not installed. Installing..."

    if [ -f "package-lock.json" ]; then
      npm ci
    else
      npm install
    fi

  fi

fi

echo "Starting your app..."

exec "$@"
