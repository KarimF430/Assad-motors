# Car Model Data Schema for AI Extraction

## 🎯 Purpose
Use this schema to extract car model data from AI (ChatGPT, Claude, etc.) for Indian car market.

## 📋 Database Schema

### **Model Object Structure**

```json
{
  "brandId": "string (required)",
  "name": "string (required)",
  "isPopular": "boolean",
  "isNew": "boolean",
  "popularRank": "number (1-20) or null",
  "newRank": "number (1-20) or null",
  "bodyType": "string",
  "subBodyType": "string",
  "launchDate": "string",
  "fuelTypes": ["array of strings"],
  "transmissions": ["array of strings"],
  "status": "active",
  "headerSeo": "string (150-200 chars)",
  "pros": "string (bullet points)",
  "cons": "string (bullet points)",
  "description": "string (300-500 words)",
  "exteriorDesign": "string (150-250 words)",
  "comfortConvenience": "string (150-250 words)",
  "engineSummaries": [
    {
      "title": "string",
      "summary": "string",
      "transmission": "string",
      "power": "string",
      "torque": "string",
      "speed": "string"
    }
  ],
  "mileageData": [
    {
      "engineName": "string",
      "companyClaimed": "string",
      "cityRealWorld": "string",
      "highwayRealWorld": "string"
    }
  ],
  "faqs": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
```

## 🏷️ Brand IDs Reference

```
Tata Motors: brand-tata
Maruti Suzuki: brand-maruti-suzuki
Hyundai: brand-hyundai
Mahindra: brand-mahindra
Kia: brand-kia
Toyota: brand-toyota
Honda: brand-honda
MG Motor: brand-mg
Renault: brand-renault
Nissan: brand-nissan
```

## 📝 Field Specifications

### **Basic Information**

| Field | Type | Required | Format | Example |
|-------|------|----------|--------|---------|
| `brandId` | String | ✅ | `brand-{name}` | `brand-tata` |
| `name` | String | ✅ | Model name | `Nexon` |
| `status` | String | ✅ | Fixed value | `active` |
| `isPopular` | Boolean | No | true/false | `true` |
| `isNew` | Boolean | No | true/false | `false` |
| `popularRank` | Number | No | 1-20 or null | `3` |
| `newRank` | Number | No | 1-20 or null | `null` |

### **Classification**

| Field | Type | Values | Example |
|-------|------|--------|---------|
| `bodyType` | String | SUV, Sedan, Hatchback, MUV, Minivan, Coupe, Convertible | `SUV` |
| `subBodyType` | String | Compact SUV, Mid-size SUV, Premium Hatchback, etc. | `Compact SUV` |
| `launchDate` | String | "Launched", "Coming Soon", or year | `Launched` |

### **Technical Specs**

| Field | Type | Format | Example |
|-------|------|--------|---------|
| `fuelTypes` | Array | Petrol, Diesel, Electric, CNG, Hybrid | `["Petrol", "Diesel"]` |
| `transmissions` | Array | Manual, Automatic, AMT, DCT, CVT, iMT | `["Manual", "Automatic"]` |

### **Content Fields**

| Field | Length | Format | Purpose |
|-------|--------|--------|---------|
| `headerSeo` | 150-200 chars | SEO-friendly description | Meta description |
| `description` | 300-500 words | Detailed overview | Main content |
| `pros` | 5-7 points | Bullet points with `•` | Advantages |
| `cons` | 5-7 points | Bullet points with `•` | Disadvantages |
| `exteriorDesign` | 150-250 words | Design description | Exterior details |
| `comfortConvenience` | 150-250 words | Features description | Interior/comfort |

### **Engine Summaries Array**

Each engine variant needs:

```json
{
  "title": "1.5L Petrol Manual",
  "summary": "The 1.5L naturally aspirated petrol engine produces 115 PS and 144 Nm...",
  "transmission": "6-Speed Manual",
  "power": "115 PS @ 6300 rpm",
  "torque": "144 Nm @ 4500 rpm",
  "speed": "180 km/h"
}
```

**Format Rules:**
- `title`: `[Capacity] [Fuel Type] [Transmission]`
- `power`: `[PS/HP] @ [RPM]`
- `torque`: `[Nm] @ [RPM]`
- `speed`: `[km/h]` (top speed)

### **Mileage Data Array**

Each engine's mileage:

```json
{
  "engineName": "1.5L Petrol Manual",
  "companyClaimed": "17.4 kmpl",
  "cityRealWorld": "12-14 kmpl",
  "highwayRealWorld": "16-18 kmpl"
}
```

**Format Rules:**
- `engineName`: Must match engine title exactly
- `companyClaimed`: ARAI certified (XX.X kmpl)
- `cityRealWorld`: Range format (XX-XX kmpl)
- `highwayRealWorld`: Range format (XX-XX kmpl)

### **FAQs Array**

Minimum 4-5 FAQs per model:

```json
{
  "question": "What is the on-road price of [Model Name]?",
  "answer": "The on-road price of [Model] in Delhi starts from ₹X.XX Lakh..."
}
```

**Common FAQ Topics:**
1. Price and variants
2. Mileage/fuel efficiency
3. Features and specifications
4. Safety ratings
5. Comparison with rivals
6. Buying recommendation

## 🎯 AI Prompt Template

Use this prompt with ChatGPT/Claude to extract data:

---

### **PROMPT FOR AI:**

```
I need accurate, up-to-date specifications for the following Indian car model in JSON format:

Brand: [BRAND_NAME]
Model: [MODEL_NAME]

Please provide data in this exact JSON structure:

{
  "brandId": "brand-[brand-slug]",
  "name": "[Model Name]",
  "isPopular": [true/false based on sales],
  "isNew": [true if launched in last 12 months],
  "popularRank": [1-20 if popular, else null],
  "bodyType": "[SUV/Sedan/Hatchback/MUV]",
  "subBodyType": "[Compact SUV/Premium Hatchback/etc]",
  "launchDate": "Launched",
  "fuelTypes": ["Petrol", "Diesel", etc],
  "transmissions": ["Manual", "Automatic", etc],
  "status": "active",
  "headerSeo": "[150-200 char SEO description]",
  "pros": "• [Point 1]\n• [Point 2]\n• [Point 3]\n• [Point 4]\n• [Point 5]",
  "cons": "• [Point 1]\n• [Point 2]\n• [Point 3]\n• [Point 4]\n• [Point 5]",
  "description": "[300-500 word detailed description covering overview, features, performance, and market position]",
  "exteriorDesign": "[150-250 word description of exterior design, styling, dimensions]",
  "comfortConvenience": "[150-250 word description of interior, features, comfort, technology]",
  "engineSummaries": [
    {
      "title": "[Capacity] [Fuel] [Transmission]",
      "summary": "[Detailed engine description]",
      "transmission": "[Type]",
      "power": "[PS] @ [RPM]",
      "torque": "[Nm] @ [RPM]",
      "speed": "[km/h]"
    }
  ],
  "mileageData": [
    {
      "engineName": "[Match engine title]",
      "companyClaimed": "[ARAI] kmpl",
      "cityRealWorld": "[XX-XX] kmpl",
      "highwayRealWorld": "[XX-XX] kmpl"
    }
  ],
  "faqs": [
    {
      "question": "What is the on-road price of [Model]?",
      "answer": "[Detailed answer with price ranges]"
    },
    {
      "question": "What is the mileage of [Model]?",
      "answer": "[Detailed mileage information]"
    },
    {
      "question": "Is [Model] worth buying?",
      "answer": "[Buying recommendation]"
    },
    {
      "question": "[Feature question]",
      "answer": "[Feature details]"
    },
    {
      "question": "[Comparison question]",
      "answer": "[Comparison details]"
    }
  ]
}

Requirements:
1. Use current 2024-2025 data for Indian market
2. Prices in Indian Rupees (Lakh)
3. All technical specs must be accurate
4. Include all available engine variants
5. Real-world mileage should be realistic estimates
6. FAQs should be comprehensive and helpful
7. Use proper Indian English
8. Include safety ratings if available (Global NCAP)
```

---

## 📊 Models to Extract (36 Brands)

### **Tata Motors (7 models)**
```
- Nexon (Compact SUV)
- Punch (Micro SUV)
- Tiago (Hatchback)
- Harrier (Mid-size SUV)
- Safari (7-seater SUV)
- Altroz (Premium Hatchback)
- Tigor (Sedan)
```

### **Maruti Suzuki (12 models)**
```
- Swift (Premium Hatchback)
- Dzire (Compact Sedan)
- Wagon R (Tall Boy Hatchback)
- Baleno (Premium Hatchback)
- Brezza (Compact SUV)
- Ertiga (7-seater MUV)
- Grand Vitara (Mid-size SUV)
- Fronx (Compact SUV)
- Ciaz (Sedan)
- Celerio (Entry Hatchback)
- S-Presso (Entry SUV)
- Ignis (Compact Hatchback)
```

### **Hyundai (9 models)**
```
- Creta (Compact SUV)
- Venue (Compact SUV)
- i20 (Premium Hatchback)
- Nios (Hatchback)
- Exter (Micro SUV)
- Verna (Sedan)
- Alcazar (7-seater SUV)
- Tucson (Mid-size SUV)
- Kona EV (Electric SUV)
```

### **Mahindra (7 models)**
```
- Scorpio N (Mid-size SUV)
- Thar (Off-road SUV)
- XUV700 (Mid-size SUV)
- XUV300 (Compact SUV)
- Bolero Neo (Compact SUV)
- Bolero (MUV)
- Marazzo (MPV)
```

### **Kia (5 models)**
```
- Seltos (Compact SUV)
- Sonet (Compact SUV)
- Carens (7-seater MPV)
- EV6 (Electric SUV)
- Carnival (Luxury MPV)
```

### **Toyota (8 models)**
```
- Innova Hycross (MPV)
- Glanza (Premium Hatchback)
- Urban Cruiser Hyryder (Compact SUV)
- Fortuner (Full-size SUV)
- Camry (Luxury Sedan)
- Hilux (Pickup Truck)
- Vellfire (Luxury MPV)
- Rumion (Compact MPV)
```

### **Honda (4 models)**
```
- City (Sedan)
- Amaze (Compact Sedan)
- Elevate (Compact SUV)
- City Hybrid (Hybrid Sedan)
```

### **MG Motor (5 models)**
```
- Hector (Mid-size SUV)
- Astor (Compact SUV)
- ZS EV (Electric SUV)
- Gloster (Full-size SUV)
- Comet EV (Electric Hatchback)
```

### **Renault (3 models)**
```
- Kiger (Compact SUV)
- Triber (Compact MPV)
- Kwid (Entry Hatchback)
```

### **Nissan (1 model)**
```
- Magnite (Compact SUV)
```

## 💾 Output Format

Save each model as a separate JSON file:

```
brand-tata-nexon.json
brand-maruti-suzuki-swift.json
brand-hyundai-creta.json
etc.
```

Or combine all in one array:

```json
[
  { /* Model 1 */ },
  { /* Model 2 */ },
  { /* Model 3 */ }
]
```

## ✅ Validation Checklist

Before importing, verify each model has:

- ✅ Valid brandId (matches brand list)
- ✅ Model name is correct
- ✅ At least 1 engine variant
- ✅ Matching mileage data for each engine
- ✅ At least 4 FAQs
- ✅ All required text fields filled
- ✅ Proper formatting (units, ranges, etc.)
- ✅ Current 2024-2025 data

## 🔄 Import Process

Once you have the JSON data:

1. **Validate JSON** - Use online JSON validator
2. **Save to file** - `models_data.json`
3. **Use backend API** - POST to `/api/models` with auth token
4. **Batch import** - Or use bulk import endpoint

## 📚 Example Complete Model

```json
{
  "brandId": "brand-tata",
  "name": "Nexon",
  "isPopular": true,
  "isNew": false,
  "popularRank": 3,
  "newRank": null,
  "bodyType": "SUV",
  "subBodyType": "Compact SUV",
  "launchDate": "Launched",
  "fuelTypes": ["Petrol", "Diesel", "Electric"],
  "transmissions": ["Manual", "Automatic"],
  "status": "active",
  "headerSeo": "Tata Nexon is India's safest compact SUV with 5-star Global NCAP rating. Available in petrol, diesel, and electric variants with premium features.",
  "pros": "• 5-star Global NCAP safety rating\n• Spacious and premium cabin\n• Available in petrol, diesel, and EV\n• Feature-rich across variants\n• Strong build quality\n• Competitive pricing",
  "cons": "• Diesel engine can be noisy\n• Ride quality could be better\n• Infotainment system needs improvement\n• Rear seat comfort average",
  "description": "The Tata Nexon is a compact SUV that has set new benchmarks in safety...",
  "exteriorDesign": "The Nexon features Tata's Impact 2.0 design language...",
  "comfortConvenience": "The Nexon's cabin is modern and spacious...",
  "engineSummaries": [
    {
      "title": "1.2L Turbo Petrol Manual",
      "summary": "The 1.2L Revotron turbo-petrol engine delivers 120 PS and 170 Nm...",
      "transmission": "6-Speed Manual",
      "power": "120 PS @ 5500 rpm",
      "torque": "170 Nm @ 1750-4000 rpm",
      "speed": "180 km/h"
    }
  ],
  "mileageData": [
    {
      "engineName": "1.2L Turbo Petrol Manual",
      "companyClaimed": "17.4 kmpl",
      "cityRealWorld": "13-15 kmpl",
      "highwayRealWorld": "17-19 kmpl"
    }
  ],
  "faqs": [
    {
      "question": "What is the on-road price of Tata Nexon?",
      "answer": "The on-road price of Tata Nexon in Delhi starts from ₹8.15 Lakh..."
    }
  ]
}
```

---

**Use this schema to get accurate data from AI, then import to your backend!** 🚀
