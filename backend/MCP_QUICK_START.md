# Killerwhale MCP Server - Quick Start Guide

## 🚀 What is This?

The Killerwhale MCP (Model Context Protocol) server allows AI assistants like Claude to directly access your car platform data through natural language.

## ✅ Installation Complete!

The MCP server has been installed and configured. Here's what was added:

### Files Created:
- `/backend/server/mcp-server.ts` - Main MCP server
- `/backend/mcp-config.json` - Configuration file

### Scripts Added to package.json:
- `npm run mcp:dev` - Run MCP server in development
- `npm run mcp:build` - Build MCP server for production
- `npm run mcp:start` - Run built MCP server

## 🎯 Quick Test

### 1. Start the MCP Server (Development)

```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run mcp:dev
```

You should see:
```
✅ Connected to MongoDB (read-only mode)
✅ Connected to Redis
🚀 Killerwhale MCP Server running on stdio
```

### 2. Configure Claude Desktop

Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "killerwhale": {
      "command": "node",
      "args": [
        "/Applications/WEBSITE-23092025-101/backend/dist/mcp-server.js"
      ],
      "env": {
        "MONGODB_URI": "your_mongodb_uri_here",
        "REDIS_URL": "your_redis_url_here"
      }
    }
  }
}
```

**Note:** Replace the MongoDB and Redis URLs with your actual values from `.env`

### 3. Build for Claude Desktop

```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run mcp:build
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop app.

### 5. Test in Claude

Try these commands in Claude Desktop:

```
"Show me all car brands"
"Search for SUVs under 15 lakhs"
"Compare Hyundai Creta and Kia Seltos"
"Calculate EMI for a car priced at 14.5 lakhs"
"Show platform statistics"
"Check SEO health"
```

## 📚 Available Resources

The MCP server exposes these resources:

1. `killerwhale://brands` - All car brands
2. `killerwhale://models` - All car models
3. `killerwhale://popular` - Popular cars
4. `killerwhale://electric` - Electric vehicles
5. `killerwhale://upcoming` - Upcoming launches
6. `killerwhale://news` - Latest news
7. `killerwhale://stats` - Platform statistics
8. `killerwhale://brands/{slug}` - Specific brand
9. `killerwhale://models/{slug}` - Specific model

## 🛠️ Available Tools

1. **search_cars** - Search with filters (budget, fuel, seating, body type)
2. **compare_cars** - Compare up to 4 cars
3. **calculate_emi** - EMI calculator
4. **get_platform_stats** - Platform statistics
5. **check_seo_health** - SEO health check

## 💡 Available Prompts

1. **recommend_family_car** - Family car recommendations
2. **daily_performance_check** - Daily dashboard
3. **seo_health_scan** - SEO audit

## 🔒 Security Features

- ✅ **Read-only database access** - Cannot modify data
- ✅ **Separate process** - Runs independently from main API
- ✅ **No write operations** - 100% safe
- ✅ **Rate limiting ready** - Can be added for production

## 🐛 Troubleshooting

### MCP Server Won't Start

**Error: Cannot connect to MongoDB**
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB is running

**Error: Cannot connect to Redis**
- Check your `REDIS_URL` in `.env`
- Ensure Redis is running

### Claude Desktop Not Seeing MCP Server

1. Check the config file path is correct
2. Ensure you built the server: `npm run mcp:build`
3. Check the `dist/mcp-server.js` file exists
4. Restart Claude Desktop completely
5. Check Claude Desktop logs: `~/Library/Logs/Claude/`

### MCP Server Running But No Data

1. Ensure MongoDB has data
2. Check models have `status: 'active'`
3. Verify Redis is connected

## 📊 Example Usage

### In Claude Desktop:

**You:** "Show me all Hyundai models"

**Claude (via MCP):**
```
Hyundai Models:
1. Venue - ₹7.94-13.48L (Compact SUV)
2. Creta - ₹10.87-20.30L (Mid-size SUV)
3. Verna - ₹11.00-17.42L (Sedan)
4. Alcazar - ₹16.77-21.28L (7-seater SUV)
5. Tucson - ₹29.02-35.94L (Premium SUV)
6. Ioniq 5 - ₹44.95-50.45L (Electric SUV)
```

**You:** "Compare Creta and Seltos"

**Claude (via MCP):**
```
Comparison: Hyundai Creta vs Kia Seltos

Price:
- Creta: ₹10.87-20.30L
- Seltos: ₹10.90-20.35L

Variants:
- Creta: 15 variants
- Seltos: 18 variants

[Detailed comparison with specs, features, etc.]
```

## 🚀 Next Steps

1. ✅ Test the MCP server locally
2. ✅ Configure Claude Desktop
3. ✅ Try example queries
4. 📝 Add more tools as needed
5. 🔧 Customize prompts for your use case

## 📖 Documentation

For detailed documentation, see:
- `implementation_plan.md` - Full technical plan
- `mcp_faq.md` - Frequently asked questions
- `mcp_advanced_guide.md` - Advanced capabilities
- `mcp_user_benefits.md` - User benefits guide

## 🎉 You're All Set!

The MCP server is ready to use. Start it with `npm run mcp:dev` and configure Claude Desktop to begin!

---

**Need Help?** Check the troubleshooting section above or review the documentation files.
