# Models CSV Import Guide

## 📋 CSV Template

**File:** `models_import_template.csv`

This template contains all fields needed to import car models into the gadizone platform.

## 📊 Field Descriptions

### **Basic Information**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `brandId` | String | ✅ Yes | Brand ID from database | `brand-maruti-suzuki` |
| `name` | String | ✅ Yes | Model name | `Swift` |
| `status` | String | ✅ Yes | Model status | `active` or `inactive` |

### **Popularity & Rankings**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `isPopular` | Boolean | No | Is this a popular model? | `true` or `false` |
| `isNew` | Boolean | No | Is this a new launch? | `true` or `false` |
| `popularRank` | Number | No | Ranking in popular cars (1-20) | `1`, `2`, `3` |
| `newRank` | Number | No | Ranking in new cars (1-20) | `1`, `2`, `3` |

### **Classification**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `bodyType` | String | No | Main body type | `SUV`, `Sedan`, `Hatchback`, `MUV` |
| `subBodyType` | String | No | Sub-category | `Compact SUV`, `Premium Hatchback` |
| `launchDate` | String | No | Launch status | `Launched`, `Coming Soon`, `2024` |

### **Technical Specifications**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `fuelTypes` | Array | No | Available fuel types | `Petrol,Diesel,Electric` |
| `transmissions` | Array | No | Available transmissions | `Manual,Automatic,AMT,DCT` |
| `brochureUrl` | String | No | Link to brochure PDF | `https://example.com/brochure.pdf` |

### **SEO & Marketing Content**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `headerSeo` | Text | No | SEO-friendly header description | See template |
| `description` | Long Text | No | Detailed model description | See template |
| `pros` | Text | No | Bullet points of advantages | Use `•` for bullets, `\n` for new lines |
| `cons` | Text | No | Bullet points of disadvantages | Use `•` for bullets, `\n` for new lines |

### **Design & Features**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `exteriorDesign` | Long Text | No | Exterior design description | See template |
| `comfortConvenience` | Long Text | No | Interior & comfort features | See template |

### **Engine & Performance (JSON)**

| Field | Type | Required | Description | Format |
|-------|------|----------|-------------|--------|
| `engineSummaries` | JSON Array | No | Engine specifications | See JSON format below |
| `mileageData` | JSON Array | No | Fuel efficiency data | See JSON format below |
| `faqs` | JSON Array | No | Frequently asked questions | See JSON format below |

## 📝 JSON Field Formats

### **Engine Summaries Format:**
```json
[
  {
    "title": "1.2L Petrol Manual",
    "summary": "Description of this engine variant",
    "transmission": "5-Speed Manual",
    "power": "90 PS @ 6000 rpm",
    "torque": "113 Nm @ 4400 rpm",
    "speed": "165 km/h"
  }
]
```

### **Mileage Data Format:**
```json
[
  {
    "engineName": "1.2L Petrol Manual",
    "companyClaimed": "25.75 kmpl",
    "cityRealWorld": "18-20 kmpl",
    "highwayRealWorld": "22-24 kmpl"
  }
]
```

### **FAQs Format:**
```json
[
  {
    "question": "What is the price of this car?",
    "answer": "The price starts from ₹6.49 Lakh..."
  }
]
```

## 🔧 How to Use

### **Step 1: Get Brand IDs**

First, get the correct brand IDs from the database:

```bash
curl http://localhost:5001/api/brands | jq '.[] | {id, name}'
```

Common brand IDs:
- `brand-maruti-suzuki`
- `brand-hyundai`
- `brand-tata`
- `brand-mahindra`
- `brand-honda`
- `brand-toyota`
- `brand-kia`

### **Step 2: Fill the CSV**

1. Open `models_import_template.csv` in Excel or Google Sheets
2. Copy the sample row and modify for your model
3. Fill all required fields (marked with ✅)
4. Fill optional fields as needed
5. For JSON fields, use the exact format shown above

### **Step 3: Format JSON Fields**

**Important:** JSON fields must be properly escaped in CSV:
- Use double quotes for JSON
- Escape inner quotes with `""`
- Keep JSON on single line
- No line breaks inside JSON

**Example in CSV:**
```csv
"[{""question"":""What is the price?"",""answer"":""Price starts from ₹6.49 Lakh""}]"
```

### **Step 4: Import the CSV**

Create an import script or use the admin panel to import the CSV data.

## 📋 Field Validation Rules

### **Required Fields:**
- `brandId` - Must exist in brands table
- `name` - Must be unique per brand
- `status` - Must be `active` or `inactive`

### **Optional Fields:**
- All other fields can be left empty
- Empty fields will use default values

### **Array Fields:**
- `fuelTypes` - Comma-separated: `Petrol,Diesel,CNG,Electric`
- `transmissions` - Comma-separated: `Manual,Automatic,AMT,DCT,CVT`

### **Boolean Fields:**
- `isPopular` - `true` or `false` (lowercase)
- `isNew` - `true` or `false` (lowercase)

### **Number Fields:**
- `popularRank` - Integer 1-20 or empty
- `newRank` - Integer 1-20 or empty

## 💡 Tips & Best Practices

### **Content Writing:**

1. **Header SEO** (150-200 characters)
   - Include model name, key features, and fuel types
   - Make it search-engine friendly

2. **Description** (300-500 words)
   - Comprehensive overview of the model
   - Include key selling points
   - Mention engine options and variants

3. **Pros & Cons**
   - 5-7 points each
   - Use bullet points with `•`
   - Be specific and factual

4. **Design Descriptions** (150-250 words each)
   - Exterior: Grille, lights, wheels, colors
   - Interior: Dashboard, features, space, comfort

### **Engine Data:**

1. **Engine Summaries**
   - One entry per engine-transmission combo
   - Include all technical specs
   - Mention key characteristics

2. **Mileage Data**
   - Company claimed (ARAI certified)
   - Real-world city mileage
   - Real-world highway mileage

### **FAQs:**

1. **Common Questions:**
   - Price and variants
   - Mileage and fuel efficiency
   - Features and specifications
   - Comparison with rivals
   - Buying advice

2. **Answer Format:**
   - Clear and concise
   - Include specific numbers
   - Mention variant differences

## 🚨 Common Mistakes to Avoid

1. ❌ **Wrong Brand ID** - Always verify brand ID exists
2. ❌ **Duplicate Model Names** - Check if model already exists for brand
3. ❌ **Invalid JSON** - Use online JSON validator before importing
4. ❌ **Line Breaks in CSV** - Keep each row on single line
5. ❌ **Missing Quotes** - Escape quotes properly in JSON fields
6. ❌ **Wrong Boolean Values** - Use lowercase `true`/`false`

## 📊 Sample Data Structure

The template includes 3 complete examples:
1. **Maruti Suzuki Swift** - Premium Hatchback
2. **Hyundai Creta** - Compact SUV with multiple engines
3. **Tata Nexon** - Safety-focused SUV

Study these examples to understand:
- Content length and style
- JSON formatting
- Technical specifications
- FAQ structure

## 🔄 Bulk Import Process

### **For Multiple Models:**

1. Copy the template
2. Add one row per model
3. Ensure all JSON is properly formatted
4. Validate CSV structure
5. Import via admin panel or API

### **Import Script Example:**

```javascript
const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('models_import_template.csv')
  .pipe(csv())
  .on('data', async (row) => {
    // Parse JSON fields
    row.engineSummaries = JSON.parse(row.engineSummaries || '[]');
    row.mileageData = JSON.parse(row.mileageData || '[]');
    row.faqs = JSON.parse(row.faqs || '[]');
    
    // Parse arrays
    row.fuelTypes = row.fuelTypes.split(',');
    row.transmissions = row.transmissions.split(',');
    
    // Parse booleans
    row.isPopular = row.isPopular === 'true';
    row.isNew = row.isNew === 'true';
    
    // Import to database
    await importModel(row);
  });
```

## 📚 Additional Resources

- **Brand IDs:** Check `/api/brands` endpoint
- **Validation:** Use JSON validators online
- **CSV Tools:** Use Google Sheets or Excel
- **Testing:** Import one model first to test

---

**Need Help?** Check the sample data in `models_import_template.csv` for complete examples!
