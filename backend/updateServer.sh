#!/bin/bash

# ============================================================
# SOCS Booking App — Mimi Deploy Script
# Usage: bash deploy.sh
# Run this from your LOCAL machine to deploy latest code to Mimi
# ============================================================

MIMI_HOST="winter2026-comp307-group15"
MIMI_BACKEND_PATH="/home/cs307-user/git_repo/SOCS-Booking-Application-Project/backend"

echo ""
echo "============================================"
echo "   SOCS Booking App — Deploying to Mimi    "
echo "============================================"
echo ""

echo "🔗 Connecting to Mimi and deploying..."

ssh $MIMI_HOST << 'ENDSSH'

  echo ""
  echo "📂 Navigating to backend folder..."
  cd /home/cs307-user/git_repo/SOCS-Booking-Application-Project

  echo "⬇️  Pulling latest code from dev-backend..."
  git checkout dev-backend
  git pull origin dev-backend

  echo "📦 Installing dependencies..."
  cd backend
  npm install

  echo "🔪 Killing existing tmux server session..."
  tmux kill-session -t backend 2>/dev/null || echo "No existing session to kill"

  echo "🚀 Starting server in tmux..."
  tmux new-session -d -s backend
  tmux send-keys -t backend 'node server.js' Enter

  echo ""
  echo "✅ Server deployed and running!"
  echo "   Detaching from tmux..."

ENDSSH

echo ""
echo "============================================"
echo "   ✅ Deployment complete!"
echo "   🌐 Server: https://winter2026-comp307-group15.cs.mcgill.ca"
echo "============================================"
echo ""
