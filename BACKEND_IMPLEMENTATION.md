# Backend Implementation Guide for Popular Comparisons

## 📁 Files to Create in Your Backend

### 1. Database Schema (if using MongoDB/Mongoose)

**File: `backend/models/PopularComparison.js`**

```javascript
const mongoose = require('mongoose');

const popularComparisonSchema = new mongoose.Schema({
  model1Id: {
    type: String,
    required: true,
    ref: 'Model'
  },
  model2Id: {
    type: String,
    required: true,
    ref: 'Model'
  },
  order: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique order
popularComparisonSchema.index({ order: 1 }, { unique: true });

module.exports = mongoose.model('PopularComparison', popularComparisonSchema);
```

### 2. API Routes

**File: `backend/routes/popularComparisons.js`**

```javascript
const express = require('express');
const router = express.Router();
const PopularComparison = require('../models/PopularComparison');

// GET - Fetch all popular comparisons
router.get('/', async (req, res) => {
  try {
    const comparisons = await PopularComparison.find({ isActive: true })
      .sort({ order: 1 })
      .limit(10);
    
    res.json(comparisons);
  } catch (error) {
    console.error('Error fetching popular comparisons:', error);
    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
});

// POST - Save/Update popular comparisons (bulk operation)
router.post('/', async (req, res) => {
  try {
    const comparisons = req.body;
    
    if (!Array.isArray(comparisons)) {
      return res.status(400).json({ error: 'Expected array of comparisons' });
    }

    // Validate comparisons
    for (let i = 0; i < comparisons.length; i++) {
      const comp = comparisons[i];
      if (!comp.model1Id || !comp.model2Id) {
        return res.status(400).json({ 
          error: `Comparison at index ${i} is missing model IDs` 
        });
      }
      comp.order = i + 1; // Ensure order is set
    }

    // Delete all existing comparisons
    await PopularComparison.deleteMany({});

    // Insert new comparisons
    const savedComparisons = await PopularComparison.insertMany(comparisons);

    res.json({
      success: true,
      count: savedComparisons.length,
      comparisons: savedComparisons
    });
  } catch (error) {
    console.error('Error saving popular comparisons:', error);
    res.status(500).json({ error: 'Failed to save comparisons' });
  }
});

// DELETE - Remove a specific comparison
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await PopularComparison.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comparison:', error);
    res.status(500).json({ error: 'Failed to delete comparison' });
  }
});

module.exports = router;
```

### 3. Register Routes in Main Server

**File: `backend/server.js` or `backend/app.js`**

```javascript
// Add this with your other route imports
const popularComparisonsRoutes = require('./routes/popularComparisons');

// Register the route
app.use('/api/popular-comparisons', popularComparisonsRoutes);
```

---

## 🗄️ Alternative: SQL/PostgreSQL Implementation

**File: `backend/models/popularComparison.sql`**

```sql
CREATE TABLE popular_comparisons (
  id SERIAL PRIMARY KEY,
  model1_id VARCHAR(255) NOT NULL,
  model2_id VARCHAR(255) NOT NULL,
  order_number INTEGER NOT NULL UNIQUE CHECK (order_number >= 1 AND order_number <= 10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (model1_id) REFERENCES models(id),
  FOREIGN KEY (model2_id) REFERENCES models(id)
);

CREATE INDEX idx_popular_comparisons_order ON popular_comparisons(order_number);
```

**File: `backend/routes/popularComparisons.js` (SQL version)**

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Your PostgreSQL connection pool

// GET - Fetch all popular comparisons
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM popular_comparisons WHERE is_active = true ORDER BY order_number ASC LIMIT 10'
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching popular comparisons:', error);
    res.status(500).json({ error: 'Failed to fetch comparisons' });
  }
});

// POST - Save/Update popular comparisons
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const comparisons = req.body;
    
    if (!Array.isArray(comparisons)) {
      return res.status(400).json({ error: 'Expected array of comparisons' });
    }

    await client.query('BEGIN');

    // Delete all existing comparisons
    await client.query('DELETE FROM popular_comparisons');

    // Insert new comparisons
    for (let i = 0; i < comparisons.length; i++) {
      const comp = comparisons[i];
      await client.query(
        'INSERT INTO popular_comparisons (model1_id, model2_id, order_number, is_active) VALUES ($1, $2, $3, $4)',
        [comp.model1Id, comp.model2Id, i + 1, true]
      );
    }

    await client.query('COMMIT');

    res.json({ success: true, count: comparisons.length });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving popular comparisons:', error);
    res.status(500).json({ error: 'Failed to save comparisons' });
  } finally {
    client.release();
  }
});

module.exports = router;
```

---

## 🧪 Testing the Endpoints

### Test GET endpoint:
```bash
curl http://localhost:3001/api/popular-comparisons
```

### Test POST endpoint:
```bash
curl -X POST http://localhost:3001/api/popular-comparisons \
  -H "Content-Type: application/json" \
  -d '[
    {
      "model1Id": "model-id-1",
      "model2Id": "model-id-2",
      "order": 1
    },
    {
      "model1Id": "model-id-3",
      "model2Id": "model-id-4",
      "order": 2
    }
  ]'
```

---

## 📝 Summary

**What you need to do:**

1. ✅ Create the database model/schema
2. ✅ Create the API routes file
3. ✅ Register routes in your main server file
4. ✅ Test the endpoints

**The frontend is already complete and will work once these backend endpoints are implemented!**
