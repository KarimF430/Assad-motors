# AI Data Extraction & Import Guide

## 🎯 Quick Start - 3 Steps

### **Step 1: Extract Data from AI**
### **Step 2: Save as JSON**
### **Step 3: Import to Backend**

---

## 📋 Step-by-Step Process

### **STEP 1: Get Data from ChatGPT/Claude**

1. **Open ChatGPT or Claude**

2. **Use this prompt for EACH model:**

```
I need accurate, up-to-date specifications for the following Indian car model in JSON format:

Brand: Tata Motors
Model: Nexon

Please provide data in this exact JSON structure following the schema in MODEL_DATA_SCHEMA_FOR_AI.md

Include:
- All engine variants available in India (2024-2025)
- ARAI certified mileage + real-world estimates
- Current prices in Indian market
- 5 comprehensive FAQs
- Detailed descriptions (300-500 words)
- Pros and cons (5-7 points each)
- Technical specifications (power, torque, transmission)

Use current data for Indian market only.
```

3. **Copy the JSON response**

4. **Repeat for all 60+ models** (or batch them)

---

### **STEP 2: Prepare JSON File**

#### **Option A: Single File (Recommended)**

Create `models_data.json` with all models:

```json
[
  {
    "brandId": "brand-tata",
    "name": "Nexon",
    "isPopular": true,
    ...
  },
  {
    "brandId": "brand-tata",
    "name": "Punch",
    "isPopular": true,
    ...
  },
  {
    "brandId": "brand-maruti-suzuki",
    "name": "Swift",
    "isPopular": true,
    ...
  }
]
```

#### **Option B: Separate Files**

Create one file per model:
- `tata-nexon.json`
- `tata-punch.json`
- `maruti-swift.json`
- etc.

Then combine them:
```bash
# Combine all JSON files
node -e "
const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.json'));
const data = files.map(f => JSON.parse(fs.readFileSync(f)));
fs.writeFileSync('models_data.json', JSON.stringify(data, null, 2));
"
```

---

### **STEP 3: Import to Backend**

#### **Method 1: Using Import Script**

```bash
# Set your backend URL and auth token
export BACKEND_URL=http://localhost:5001
export AUTH_TOKEN=your-auth-token-here

# Run import
node import-models-from-json.js
```

#### **Method 2: Manual API Calls**

```bash
# Import single model
curl -X POST http://localhost:5001/api/models \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @tata-nexon.json
```

#### **Method 3: Using Admin Panel**

1. Login to admin panel
2. Go to Models > Import
3. Upload `models_data.json`
4. Review and confirm

---

## 🎯 AI Prompt Templates

### **Template 1: Single Model (Detailed)**

```
Extract complete specifications for [BRAND] [MODEL] for Indian market (2024-2025).

Format as JSON following this structure:
{
  "brandId": "brand-[slug]",
  "name": "[Model Name]",
  "bodyType": "[SUV/Sedan/Hatchback]",
  "fuelTypes": ["Petrol", "Diesel", etc],
  "transmissions": ["Manual", "Automatic", etc],
  "engineSummaries": [
    {
      "title": "[Capacity] [Fuel] [Transmission]",
      "power": "[PS] @ [RPM]",
      "torque": "[Nm] @ [RPM]",
      "transmission": "[Type]",
      "speed": "[km/h]",
      "summary": "[Description]"
    }
  ],
  "mileageData": [
    {
      "engineName": "[Match engine title]",
      "companyClaimed": "[ARAI kmpl]",
      "cityRealWorld": "[XX-XX kmpl]",
      "highwayRealWorld": "[XX-XX kmpl]"
    }
  ],
  "description": "[300-500 words about the car]",
  "pros": "• [Point 1]\n• [Point 2]\n• [Point 3]\n• [Point 4]\n• [Point 5]",
  "cons": "• [Point 1]\n• [Point 2]\n• [Point 3]\n• [Point 4]\n• [Point 5]",
  "faqs": [
    {"question": "What is the price?", "answer": "[Answer]"},
    {"question": "What is the mileage?", "answer": "[Answer]"},
    {"question": "Is it worth buying?", "answer": "[Answer]"},
    {"question": "[Feature question]", "answer": "[Answer]"},
    {"question": "[Comparison question]", "answer": "[Answer]"}
  ]
}

Include all current variants, accurate prices, and real specifications.
```

### **Template 2: Batch Request (Multiple Models)**

```
Extract specifications for these Indian car models in JSON array format:

1. Tata Nexon
2. Tata Punch
3. Tata Harrier

For each model, provide complete data following the schema in MODEL_DATA_SCHEMA_FOR_AI.md

Return as:
[
  { /* Nexon data */ },
  { /* Punch data */ },
  { /* Harrier data */ }
]
```

### **Template 3: Update Existing Model**

```
Update specifications for [BRAND] [MODEL] with latest 2024-2025 data.

Current data: [paste existing JSON]

Please update:
- Prices (if changed)
- New variants (if any)
- Mileage figures
- Features list
- FAQs

Return complete updated JSON.
```

---

## 📊 Brand & Model List

### **Quick Copy-Paste for AI**

```
Extract data for these models:

TATA MOTORS:
- Nexon, Punch, Tiago, Harrier, Safari, Altroz, Tigor

MARUTI SUZUKI:
- Swift, Dzire, Wagon R, Baleno, Brezza, Ertiga, Grand Vitara, Fronx, Ciaz, Celerio, S-Presso, Ignis

HYUNDAI:
- Creta, Venue, i20, Nios, Exter, Verna, Alcazar, Tucson, Kona EV

MAHINDRA:
- Scorpio N, Thar, XUV700, XUV300, Bolero Neo, Bolero, Marazzo

KIA:
- Seltos, Sonet, Carens, EV6, Carnival

TOYOTA:
- Innova Hycross, Glanza, Urban Cruiser Hyryder, Fortuner, Camry, Hilux, Vellfire, Rumion

HONDA:
- City, Amaze, Elevate, City Hybrid

MG MOTOR:
- Hector, Astor, ZS EV, Gloster, Comet EV

RENAULT:
- Kiger, Triber, Kwid

NISSAN:
- Magnite
```

---

## ✅ Validation Checklist

Before importing, verify each model:

### **Required Fields:**
- ✅ `brandId` (correct format: brand-name)
- ✅ `name` (model name)
- ✅ `status` (set to "active")

### **Content Quality:**
- ✅ Description is 300-500 words
- ✅ Pros/cons have 5-7 points each
- ✅ At least 1 engine variant
- ✅ Mileage data for each engine
- ✅ At least 4 FAQs

### **Data Accuracy:**
- ✅ Current 2024-2025 prices
- ✅ Correct technical specifications
- ✅ ARAI certified mileage
- ✅ Real-world mileage estimates
- ✅ All available variants included

### **Format Validation:**
- ✅ Valid JSON syntax
- ✅ Proper units (PS, Nm, kmpl, km/h)
- ✅ Consistent formatting
- ✅ No missing commas or brackets

---

## 🔧 Troubleshooting

### **Issue: AI gives incomplete data**

**Solution:** Be more specific in prompt
```
Include ALL engine variants available in India.
Include EXACT power and torque figures with RPM.
Include ARAI certified mileage for each variant.
```

### **Issue: JSON syntax errors**

**Solution:** Validate JSON
```bash
# Use online validator
https://jsonlint.com/

# Or use jq
cat models_data.json | jq .
```

### **Issue: Import fails with 400 error**

**Solution:** Check required fields
- Verify brandId exists in database
- Ensure name is not duplicate
- Check all required fields are present

### **Issue: Mileage data doesn't match engines**

**Solution:** Ensure engineName matches exactly
```json
// Engine
"title": "1.2L Petrol Manual"

// Mileage (must match exactly)
"engineName": "1.2L Petrol Manual"
```

---

## 💡 Pro Tips

### **Tip 1: Batch Processing**

Ask AI for 5-10 models at once:
```
Give me data for these 5 Tata models: Nexon, Punch, Tiago, Harrier, Safari
```

### **Tip 2: Use AI for Validation**

```
Validate this JSON against the schema and fix any errors:
[paste your JSON]
```

### **Tip 3: Incremental Import**

Import in batches:
1. Import 10 models
2. Verify on website
3. Import next 10
4. Repeat

### **Tip 4: Save Prompts**

Create a text file with your successful prompts for reuse.

### **Tip 5: Version Control**

```bash
# Save each batch
cp models_data.json models_data_backup_$(date +%Y%m%d).json
```

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `MODEL_DATA_SCHEMA_FOR_AI.md` | Complete schema documentation |
| `models_data.json` | Your extracted data (create this) |
| `import-models-from-json.js` | Import script |
| `import_results.json` | Import results log |

---

## 🚀 Quick Commands

```bash
# Validate JSON
cat models_data.json | jq .

# Count models
cat models_data.json | jq 'length'

# List model names
cat models_data.json | jq '.[].name'

# Import to backend
export AUTH_TOKEN=your-token
node import-models-from-json.js

# Check import results
cat import_results.json | jq .
```

---

**Ready to extract data! Start with MODEL_DATA_SCHEMA_FOR_AI.md** 🎯
