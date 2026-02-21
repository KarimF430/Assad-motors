/**
 * Scheduled API Fetcher
 * Fetches data from external APIs only at specific times to save API tokens
 * Schedule: 1:00 PM and 8:00 PM daily
 */

const cron = require('node-cron');
const fs = require('fs').promises;
const path = require('path');

class ScheduledFetcher {
  constructor() {
    this.isRunning = false;
    this.lastFetchTimes = {
      afternoon: null,
      evening: null
    };
    this.cacheFile = path.join(__dirname, '../cache/fetch-cache.json');
    this.logFile = path.join(__dirname, '../logs/scheduler.log');
    
    // Load previous fetch times
    this.loadFetchHistory();
  }

  /**
   * Initialize the scheduler
   */
  async init() {
    console.log('🕐 Initializing Scheduled API Fetcher...');
    
    // Create necessary directories
    await this.ensureDirectories();
    
    // Schedule for 1:00 PM (13:00) - Cron: 0 13 * * *
    cron.schedule('0 13 * * *', async () => {
      await this.executeFetch('afternoon', '1:00 PM');
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata" // IST timezone
    });

    // Schedule for 8:00 PM (20:00) - Cron: 0 20 * * *
    cron.schedule('0 20 * * *', async () => {
      await this.executeFetch('evening', '8:00 PM');
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata" // IST timezone
    });

    console.log('✅ Scheduler initialized successfully');
    console.log('📅 Next fetches scheduled for: 1:00 PM and 8:00 PM IST');
    
    await this.logEvent('Scheduler initialized');
  }

  /**
   * Execute the API fetch
   */
  async executeFetch(timeSlot, timeLabel) {
    if (this.isRunning) {
      console.log('⏳ Fetch already in progress, skipping...');
      return;
    }

    try {
      this.isRunning = true;
      const startTime = new Date();
      
      console.log(`🚀 Starting scheduled fetch at ${timeLabel} (${startTime.toISOString()})`);
      await this.logEvent(`Starting ${timeSlot} fetch at ${timeLabel}`);

      // Check if we already fetched today for this time slot
      if (await this.alreadyFetchedToday(timeSlot)) {
        console.log(`✅ Already fetched for ${timeLabel} today, skipping...`);
        return;
      }

      // Perform the actual API fetches
      const results = await this.performAPIFetches();
      
      // Update fetch history
      this.lastFetchTimes[timeSlot] = startTime.toISOString();
      await this.saveFetchHistory();
      
      // Cache the results
      await this.cacheResults(results, timeSlot);
      
      const endTime = new Date();
      const duration = endTime - startTime;
      
      console.log(`✅ Fetch completed successfully in ${duration}ms`);
      await this.logEvent(`${timeSlot} fetch completed successfully. Duration: ${duration}ms. Results: ${JSON.stringify(results.summary)}`);
      
    } catch (error) {
      console.error(`❌ Error during ${timeLabel} fetch:`, error);
      await this.logEvent(`ERROR during ${timeSlot} fetch: ${error.message}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Perform the actual API fetches
   */
  async performAPIFetches() {
    const results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalAPICalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        tokensUsed: 0
      },
      data: {}
    };

    try {
      // Example: Fetch car data from external API
      console.log('📡 Fetching car data from external API...');
      const carData = await this.fetchCarData();
      results.data.cars = carData;
      results.summary.totalAPICalls++;
      results.summary.successfulCalls++;
      results.summary.tokensUsed += carData.tokensUsed || 0;

      // Example: Fetch brand data from external API
      console.log('📡 Fetching brand data from external API...');
      const brandData = await this.fetchBrandData();
      results.data.brands = brandData;
      results.summary.totalAPICalls++;
      results.summary.successfulCalls++;
      results.summary.tokensUsed += brandData.tokensUsed || 0;

      // Example: Fetch news/updates
      console.log('📡 Fetching news updates...');
      const newsData = await this.fetchNewsData();
      results.data.news = newsData;
      results.summary.totalAPICalls++;
      results.summary.successfulCalls++;
      results.summary.tokensUsed += newsData.tokensUsed || 0;

    } catch (error) {
      results.summary.failedCalls++;
      console.error('API fetch error:', error);
    }

    return results;
  }

  /**
   * Fetch car data from external API
   */
  async fetchCarData() {
    // Replace with your actual API endpoint and logic
    try {
      // Simulated API call - replace with actual implementation
      const response = await fetch('https://api.example.com/cars', {
        headers: {
          'Authorization': `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Car API responded with ${response.status}`);
      }

      const data = await response.json();
      
      return {
        count: data.length || 0,
        data: data,
        tokensUsed: 1, // Track token usage
        fetchTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching car data:', error);
      return {
        count: 0,
        data: [],
        tokensUsed: 0,
        error: error.message,
        fetchTime: new Date().toISOString()
      };
    }
  }

  /**
   * Fetch brand data from external API
   */
  async fetchBrandData() {
    // Replace with your actual API endpoint and logic
    try {
      // Simulated API call - replace with actual implementation
      const response = await fetch('https://api.example.com/brands', {
        headers: {
          'Authorization': `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Brand API responded with ${response.status}`);
      }

      const data = await response.json();
      
      return {
        count: data.length || 0,
        data: data,
        tokensUsed: 1, // Track token usage
        fetchTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching brand data:', error);
      return {
        count: 0,
        data: [],
        tokensUsed: 0,
        error: error.message,
        fetchTime: new Date().toISOString()
      };
    }
  }

  /**
   * Fetch news data from external API
   */
  async fetchNewsData() {
    // Replace with your actual API endpoint and logic
    try {
      // Simulated API call - replace with actual implementation
      const response = await fetch('https://api.example.com/news', {
        headers: {
          'Authorization': `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`News API responded with ${response.status}`);
      }

      const data = await response.json();
      
      return {
        count: data.length || 0,
        data: data,
        tokensUsed: 1, // Track token usage
        fetchTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching news data:', error);
      return {
        count: 0,
        data: [],
        tokensUsed: 0,
        error: error.message,
        fetchTime: new Date().toISOString()
      };
    }
  }

  /**
   * Check if we already fetched today for the given time slot
   */
  async alreadyFetchedToday(timeSlot) {
    const lastFetch = this.lastFetchTimes[timeSlot];
    if (!lastFetch) return false;

    const lastFetchDate = new Date(lastFetch);
    const today = new Date();
    
    return (
      lastFetchDate.getDate() === today.getDate() &&
      lastFetchDate.getMonth() === today.getMonth() &&
      lastFetchDate.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Cache the results
   */
  async cacheResults(results, timeSlot) {
    try {
      const cacheData = {
        [timeSlot]: results,
        lastUpdated: new Date().toISOString()
      };

      // Load existing cache
      let existingCache = {};
      try {
        const cacheContent = await fs.readFile(this.cacheFile, 'utf8');
        existingCache = JSON.parse(cacheContent);
      } catch (error) {
        // Cache file doesn't exist or is invalid, start fresh
      }

      // Merge with existing cache
      const updatedCache = { ...existingCache, ...cacheData };
      
      await fs.writeFile(this.cacheFile, JSON.stringify(updatedCache, null, 2));
      console.log(`💾 Results cached for ${timeSlot}`);
    } catch (error) {
      console.error('Error caching results:', error);
    }
  }

  /**
   * Get cached results
   */
  async getCachedResults(timeSlot = null) {
    try {
      const cacheContent = await fs.readFile(this.cacheFile, 'utf8');
      const cache = JSON.parse(cacheContent);
      
      if (timeSlot) {
        return cache[timeSlot] || null;
      }
      
      return cache;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Load fetch history
   */
  async loadFetchHistory() {
    try {
      const historyFile = path.join(__dirname, '../cache/fetch-history.json');
      const historyContent = await fs.readFile(historyFile, 'utf8');
      this.lastFetchTimes = JSON.parse(historyContent);
    } catch (error) {
      // History file doesn't exist, start fresh
      this.lastFetchTimes = {
        afternoon: null,
        evening: null
      };
    }
  }

  /**
   * Save fetch history
   */
  async saveFetchHistory() {
    try {
      const historyFile = path.join(__dirname, '../cache/fetch-history.json');
      await fs.writeFile(historyFile, JSON.stringify(this.lastFetchTimes, null, 2));
    } catch (error) {
      console.error('Error saving fetch history:', error);
    }
  }

  /**
   * Ensure necessary directories exist
   */
  async ensureDirectories() {
    const dirs = [
      path.dirname(this.cacheFile),
      path.dirname(this.logFile)
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  /**
   * Log events
   */
  async logEvent(message) {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${message}\n`;
      await fs.appendFile(this.logFile, logEntry);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastFetchTimes: this.lastFetchTimes,
      nextScheduledTimes: [
        '13:00 IST (1:00 PM)',
        '20:00 IST (8:00 PM)'
      ]
    };
  }

  /**
   * Manual trigger for testing (use sparingly to save tokens)
   */
  async manualTrigger(timeSlot = 'manual') {
    console.log('🔧 Manual trigger initiated...');
    await this.executeFetch(timeSlot, 'Manual Trigger');
  }
}

module.exports = ScheduledFetcher;
