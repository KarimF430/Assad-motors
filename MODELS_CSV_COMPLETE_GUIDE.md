# Complete Models CSV Import Guide

## 📋 New CSV Format - Easy to Edit!

**File:** `models_import_complete.csv`

This CSV has **separate columns** for each engine, mileage entry, and FAQ - making it much easier to edit in Excel or Google Sheets!

## 🎯 Column Structure

### **Basic Information (13 columns)**
```
brandId, name, isPopular, isNew, popularRank, newRank, 
bodyType, subBodyType, launchDate, fuelTypes, transmissions, 
status, headerSeo
```

### **Content Fields (5 columns)**
```
pros, cons, description, exteriorDesign, comfortConvenience
```

### **Engine Data - Up to 3 Engines (18 columns)**
```
Engine 1: engine1_title, engine1_summary, engine1_transmission, 
          engine1_power, engine1_torque, engine1_speed

Engine 2: engine2_title, engine2_summary, engine2_transmission,
          engine2_power, engine2_torque, engine2_speed

Engine 3: engine3_title, engine3_summary, engine3_transmission,
          engine3_power, engine3_torque, engine3_speed
```

### **Mileage Data - Up to 3 Entries (12 columns)**
```
Mileage 1: mileage1_engineName, mileage1_companyClaimed,
           mileage1_cityRealWorld, mileage1_highwayRealWorld

Mileage 2: mileage2_engineName, mileage2_companyClaimed,
           mileage2_cityRealWorld, mileage2_highwayRealWorld

Mileage 3: mileage3_engineName, mileage3_companyClaimed,
           mileage3_cityRealWorld, mileage3_highwayRealWorld
```

### **FAQs - Up to 5 Questions (10 columns)**
```
FAQ 1: faq1_question, faq1_answer
FAQ 2: faq2_question, faq2_answer
FAQ 3: faq3_question, faq3_answer
FAQ 4: faq4_question, faq4_answer
FAQ 5: faq5_question, faq5_answer
```

**Total: 58 columns** (all clearly labeled!)

## 📊 Field Details

### **Basic Information**

| Column | Example | Description |
|--------|---------|-------------|
| `brandId` | `brand-maruti-suzuki` | Brand ID from database |
| `name` | `Swift` | Model name |
| `isPopular` | `true` | Is popular model? |
| `isNew` | `false` | Is new launch? |
| `popularRank` | `1` | Rank in popular (1-20) |
| `newRank` | (empty) | Rank in new cars |
| `bodyType` | `Hatchback` | Main category |
| `subBodyType` | `Premium Hatchback` | Sub-category |
| `launchDate` | `Launched` | Launch status |
| `fuelTypes` | `Petrol,CNG` | Comma-separated |
| `transmissions` | `Manual,Automatic` | Comma-separated |
| `status` | `active` | Model status |
| `headerSeo` | (see example) | SEO description |

### **Content Fields**

| Column | Description | Format |
|--------|-------------|--------|
| `pros` | Advantages | Bullet points with `•` and line breaks |
| `cons` | Disadvantages | Bullet points with `•` and line breaks |
| `description` | Full description | 300-500 words paragraph |
| `exteriorDesign` | Exterior details | 150-250 words |
| `comfortConvenience` | Interior features | 150-250 words |

### **Engine Data (Repeat for engine1, engine2, engine3)**

| Column Pattern | Example | Description |
|----------------|---------|-------------|
| `engine1_title` | `1.2L Petrol Manual` | Engine variant name |
| `engine1_summary` | (see example) | Description of engine |
| `engine1_transmission` | `5-Speed Manual` | Transmission type |
| `engine1_power` | `90 PS @ 6000 rpm` | Power output |
| `engine1_torque` | `113 Nm @ 4400 rpm` | Torque output |
| `engine1_speed` | `165 km/h` | Top speed |

### **Mileage Data (Repeat for mileage1, mileage2, mileage3)**

| Column Pattern | Example | Description |
|----------------|---------|-------------|
| `mileage1_engineName` | `1.2L Petrol Manual` | Engine name (match engine title) |
| `mileage1_companyClaimed` | `25.75 kmpl` | ARAI certified mileage |
| `mileage1_cityRealWorld` | `18-20 kmpl` | Real city mileage |
| `mileage1_highwayRealWorld` | `22-24 kmpl` | Real highway mileage |

### **FAQ Data (Repeat for faq1 to faq5)**

| Column Pattern | Example | Description |
|----------------|---------|-------------|
| `faq1_question` | `What is the price?` | Question text |
| `faq1_answer` | (see example) | Detailed answer |

## 🔧 How to Use

### **Step 1: Open in Excel/Google Sheets**

```bash
# Mac
open models_import_complete.csv

# Or upload to Google Sheets
```

### **Step 2: Fill Your Data**

1. **Copy a sample row** (Swift, Creta, or Nexon)
2. **Modify the basic info** (brandId, name, etc.)
3. **Update content** (pros, cons, description)
4. **Fill engine data:**
   - If 1 engine: Fill only engine1_* columns
   - If 2 engines: Fill engine1_* and engine2_*
   - If 3 engines: Fill all engine columns
5. **Fill mileage data** (match engine names)
6. **Add FAQs** (minimum 3, maximum 5)

### **Step 3: Leave Empty Columns Blank**

- If model has only 1 engine, leave engine2_* and engine3_* empty
- If model has only 2 mileage entries, leave mileage3_* empty
- If model has only 3 FAQs, leave faq4_* and faq5_* empty

## 📝 Examples in the CSV

### **Example 1: Maruti Suzuki Swift**
- ✅ 2 Engines (Petrol Manual, Petrol AMT)
- ✅ 2 Mileage entries
- ✅ 5 FAQs
- ✅ engine3_* columns are empty

### **Example 2: Hyundai Creta**
- ✅ 3 Engines (Petrol Manual, Turbo Petrol DCT, Diesel Manual)
- ✅ 3 Mileage entries
- ✅ 5 FAQs
- ✅ All engine columns filled

### **Example 3: Tata Nexon**
- ✅ 3 Engines (Turbo Petrol Manual, Turbo Petrol AMT, Diesel Manual)
- ✅ 3 Mileage entries
- ✅ 5 FAQs
- ✅ All columns filled

## 💡 Tips for Filling Data

### **Engine Data:**

**For each engine variant:**
```
engine1_title: 1.2L Petrol Manual
engine1_summary: The 1.2L K-Series petrol engine delivers...
engine1_transmission: 5-Speed Manual
engine1_power: 90 PS @ 6000 rpm
engine1_torque: 113 Nm @ 4400 rpm
engine1_speed: 165 km/h
```

**Common Patterns:**
- Title: `[Capacity] [Fuel] [Transmission]`
- Power: `[PS] @ [RPM]` or `[HP] @ [RPM]`
- Torque: `[Nm] @ [RPM]`
- Speed: `[km/h]` or `[mph]`

### **Mileage Data:**

**Match engine names exactly:**
```
mileage1_engineName: 1.2L Petrol Manual  (same as engine1_title)
mileage1_companyClaimed: 25.75 kmpl
mileage1_cityRealWorld: 18-20 kmpl
mileage1_highwayRealWorld: 22-24 kmpl
```

**Formats:**
- Company claimed: `XX.XX kmpl` (ARAI certified)
- Real-world: `XX-XX kmpl` (range)

### **FAQ Data:**

**Common Questions to Include:**
1. **Price:** "What is the on-road price of [Model]?"
2. **Mileage:** "What is the mileage of [Model]?"
3. **Buying Advice:** "Is [Model] worth buying?"
4. **Features:** "Does [Model] have [feature]?"
5. **Comparison:** "Which is better - [Model] or [Rival]?"

**Answer Format:**
- Be specific with numbers
- Mention variant differences
- Include price ranges
- Give practical advice

## 🚨 Common Mistakes to Avoid

### ❌ **Wrong:**
```
engine1_title: Petrol
engine1_power: 90
mileage1_companyClaimed: 25
```

### ✅ **Correct:**
```
engine1_title: 1.2L Petrol Manual
engine1_power: 90 PS @ 6000 rpm
mileage1_companyClaimed: 25.75 kmpl
```

### **Other Mistakes:**

1. ❌ Mismatched engine names in mileage data
2. ❌ Missing units (PS, Nm, kmpl, km/h)
3. ❌ Inconsistent formatting
4. ❌ Empty required fields (brandId, name, status)
5. ❌ Wrong boolean values (use `true`/`false`)

## 📊 Data Validation

### **Before Importing:**

✅ Check all required fields are filled:
- `brandId` (must exist in database)
- `name` (unique per brand)
- `status` (active/inactive)

✅ Verify engine data consistency:
- Each engine has all 6 fields filled
- Mileage engineName matches engine title

✅ Validate FAQ pairs:
- Each question has an answer
- No empty question with filled answer

## 🔄 Import Process

### **Option 1: Manual Import Script**

```javascript
const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('models_import_complete.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Parse engines
    const engines = [];
    for (let i = 1; i <= 3; i++) {
      if (row[`engine${i}_title`]) {
        engines.push({
          title: row[`engine${i}_title`],
          summary: row[`engine${i}_summary`],
          transmission: row[`engine${i}_transmission`],
          power: row[`engine${i}_power`],
          torque: row[`engine${i}_torque`],
          speed: row[`engine${i}_speed`]
        });
      }
    }
    
    // Parse mileage
    const mileageData = [];
    for (let i = 1; i <= 3; i++) {
      if (row[`mileage${i}_engineName`]) {
        mileageData.push({
          engineName: row[`mileage${i}_engineName`],
          companyClaimed: row[`mileage${i}_companyClaimed`],
          cityRealWorld: row[`mileage${i}_cityRealWorld`],
          highwayRealWorld: row[`mileage${i}_highwayRealWorld`]
        });
      }
    }
    
    // Parse FAQs
    const faqs = [];
    for (let i = 1; i <= 5; i++) {
      if (row[`faq${i}_question`]) {
        faqs.push({
          question: row[`faq${i}_question`],
          answer: row[`faq${i}_answer`]
        });
      }
    }
    
    // Parse arrays
    const fuelTypes = row.fuelTypes.split(',').map(s => s.trim());
    const transmissions = row.transmissions.split(',').map(s => s.trim());
    
    // Create model object
    const model = {
      brandId: row.brandId,
      name: row.name,
      isPopular: row.isPopular === 'true',
      isNew: row.isNew === 'true',
      popularRank: row.popularRank ? parseInt(row.popularRank) : null,
      newRank: row.newRank ? parseInt(row.newRank) : null,
      bodyType: row.bodyType,
      subBodyType: row.subBodyType,
      launchDate: row.launchDate,
      fuelTypes,
      transmissions,
      status: row.status,
      headerSeo: row.headerSeo,
      pros: row.pros,
      cons: row.cons,
      description: row.description,
      exteriorDesign: row.exteriorDesign,
      comfortConvenience: row.comfortConvenience,
      engineSummaries: engines,
      mileageData: mileageData,
      faqs: faqs
    };
    
    // Import to database
    console.log('Importing:', model.name);
    // await importModel(model);
  });
```

### **Option 2: Admin Panel Upload**

1. Go to Admin Panel
2. Navigate to Models > Import
3. Upload `models_import_complete.csv`
4. Review preview
5. Confirm import

## 📈 Advantages of This Format

### ✅ **Easy to Edit:**
- Clear column names
- No JSON formatting needed
- Works in Excel/Google Sheets
- Copy-paste friendly

### ✅ **Easy to Understand:**
- Separate columns for each field
- No nested data structures
- Visual layout in spreadsheet

### ✅ **Easy to Validate:**
- See all data at once
- Spot missing fields easily
- Compare across models

### ✅ **Flexible:**
- Add 1-3 engines per model
- Add 1-3 mileage entries
- Add 3-5 FAQs
- Leave unused columns empty

## 🎯 Quick Reference

### **Minimum Required Data:**
```
brandId, name, status, description
+ At least 1 engine (engine1_*)
+ At least 1 mileage (mileage1_*)
+ At least 3 FAQs (faq1-3_*)
```

### **Recommended Data:**
```
All basic info + content fields
+ 2-3 engines with full specs
+ Matching mileage data
+ 4-5 comprehensive FAQs
```

### **Maximum Data:**
```
All 58 columns filled
+ 3 complete engines
+ 3 mileage entries
+ 5 detailed FAQs
```

---

**Ready to use! Open `models_import_complete.csv` and start adding your models!** 🚀
