/**
 * Scheduler Integration
 * Integrates the scheduled fetcher with the main server
 */

const ScheduledFetcher = require('../services/scheduledFetcher');

class SchedulerIntegration {
  constructor(app) {
    this.app = app;
    this.scheduler = new ScheduledFetcher();
  }

  /**
   * Initialize the scheduler and add API routes
   */
  async init() {
    try {
      // Initialize the scheduler
      await this.scheduler.init();
      
      // Add API routes for scheduler management
      this.addSchedulerRoutes();
      
      console.log('✅ Scheduler integration completed');
    } catch (error) {
      console.error('❌ Error initializing scheduler:', error);
    }
  }

  /**
   * Add API routes for scheduler management
   */
  addSchedulerRoutes() {
    // Get scheduler status
    this.app.get('/api/scheduler/status', (req, res) => {
      try {
        const status = this.scheduler.getStatus();
        res.json({
          success: true,
          status: status,
          message: 'Scheduler status retrieved successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get cached results
    this.app.get('/api/scheduler/cache/:timeSlot?', async (req, res) => {
      try {
        const { timeSlot } = req.params;
        const cachedData = await this.scheduler.getCachedResults(timeSlot);
        
        res.json({
          success: true,
          data: cachedData,
          message: 'Cached data retrieved successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Manual trigger (protected route - use sparingly!)
    this.app.post('/api/scheduler/trigger', async (req, res) => {
      try {
        // Add authentication check here
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            error: 'Authentication required'
          });
        }

        // Optional: Add additional security checks
        const { reason } = req.body;
        if (!reason) {
          return res.status(400).json({
            success: false,
            error: 'Reason for manual trigger is required'
          });
        }

        console.log(`🔧 Manual trigger requested. Reason: ${reason}`);
        
        // Trigger the fetch
        await this.scheduler.manualTrigger('manual');
        
        res.json({
          success: true,
          message: 'Manual fetch triggered successfully',
          warning: 'Manual triggers consume API tokens. Use sparingly.'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get fetch logs (last 100 entries)
    this.app.get('/api/scheduler/logs', async (req, res) => {
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const logFile = path.join(__dirname, '../logs/scheduler.log');
        
        try {
          const logContent = await fs.readFile(logFile, 'utf8');
          const logs = logContent.split('\n')
            .filter(line => line.trim())
            .slice(-100) // Last 100 entries
            .reverse(); // Most recent first
          
          res.json({
            success: true,
            logs: logs,
            count: logs.length
          });
        } catch (error) {
          res.json({
            success: true,
            logs: [],
            count: 0,
            message: 'No logs found'
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    console.log('📡 Scheduler API routes added:');
    console.log('   GET  /api/scheduler/status');
    console.log('   GET  /api/scheduler/cache/:timeSlot?');
    console.log('   POST /api/scheduler/trigger');
    console.log('   GET  /api/scheduler/logs');
  }
}

module.exports = SchedulerIntegration;
