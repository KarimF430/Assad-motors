/**
 * PM2 Ecosystem Configuration
 * For load balancing and auto-scaling
 * 
 * Usage:
 * pm2 start ecosystem.config.js
 * pm2 reload ecosystem.config.js
 * pm2 monit
 */

module.exports = {
  apps: [
    {
      // Frontend Next.js Application
      name: 'gadizone-frontend',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      
      // Auto-restart settings
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
    
    {
      // Backend Express Application
      name: 'gadizone-backend',
      script: './backend/dist/index.js',
      cwd: './',
      instances: 4, // Start 4 instances
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      
      // Auto-restart settings
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Load balancing
      instance_var: 'INSTANCE_ID',
      merge_logs: true,
    },
    
    {
      // Redis Cache Server (if running locally)
      name: 'redis-cache',
      script: 'redis-server',
      args: '--port 6379 --maxmemory 256mb --maxmemory-policy allkeys-lru',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    }
  ],
  
  // Deploy configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/gadizone.git',
      path: '/var/www/gadizone',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production server"',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};

/**
 * PM2 Commands Reference:
 * 
 * Start all apps:
 * pm2 start ecosystem.config.js
 * 
 * Start specific app:
 * pm2 start ecosystem.config.js --only gadizone-backend
 * 
 * Reload with zero downtime:
 * pm2 reload ecosystem.config.js
 * 
 * Scale backend to 8 instances:
 * pm2 scale gadizone-backend 8
 * 
 * Monitor all apps:
 * pm2 monit
 * 
 * View logs:
 * pm2 logs
 * pm2 logs gadizone-backend
 * 
 * Stop all:
 * pm2 stop all
 * 
 * Delete all:
 * pm2 delete all
 * 
 * Save current state:
 * pm2 save
 * 
 * Auto-start on server reboot:
 * pm2 startup
 * pm2 save
 */
