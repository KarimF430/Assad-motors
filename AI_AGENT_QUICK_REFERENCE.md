# 🚀 AI AGENT QUICK REFERENCE CARD

**⚡ INSTANT RULES FOR MOTOROCTANE PLATFORM**

---

## 🎯 **GOLDEN RULES**

### **1. NEVER BREAK**
- ❌ Existing frontend design patterns
- ❌ Backend layer architecture  
- ❌ API response contracts
- ❌ Database schema integrity
- ❌ Performance requirements (100ms response time)

### **2. ALWAYS FOLLOW**
- ✅ Established UI/UX patterns
- ✅ TypeScript strict typing
- ✅ Error handling in all functions
- ✅ Input validation with Zod schemas
- ✅ Database indexing for all queries

---

## ⚡ **PERFORMANCE TARGETS**

```typescript
const MANDATORY_TARGETS = {
  responseTime: "< 100ms",
  throughput: "10,000+ req/sec", 
  users: "1M+ daily",
  uptime: "99.9%",
  errorRate: "< 0.1%"
};
```

---

## 🏗️ **ARCHITECTURE LAYERS**

```typescript
// ✅ RESPECT THESE BOUNDARIES:
Frontend (Next.js/React)
    ↓
API Routes (Express)
    ↓  
Controllers (Business Logic)
    ↓
Services (Data Processing)
    ↓
Storage (MongoDB Operations)
    ↓
Database (MongoDB Atlas)
```

---

## 🎨 **DESIGN CONSISTENCY**

```typescript
// ✅ USE THESE PATTERNS ONLY:
const UI_PATTERNS = {
  colors: "bg-gradient-to-r from-red-500 to-orange-500",
  spacing: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  cards: "bg-white rounded-lg shadow-md hover:shadow-lg",
  buttons: "rounded-md font-medium transition-colors"
};
```

---

## 📊 **DATABASE RULES**

```typescript
// ✅ MANDATORY PATTERNS:
const DB_RULES = {
  ids: "Semantic format: brand-toyota, model-brand-toyota-camry",
  indexes: "All query fields MUST be indexed",
  validation: "Foreign key validation with pre-save hooks",
  relationships: "Brand → Model → Variant hierarchy"
};
```

---

## 🔍 **BEFORE YOU CODE**

### **Pre-Implementation Checklist**
- [ ] Read existing code patterns
- [ ] Check performance impact for 1M users
- [ ] Plan database indexes needed
- [ ] Prepare error handling strategy
- [ ] Design rollback plan

---

## 📝 **MANDATORY DOCUMENTATION**

```markdown
## Change Record: CR-2025-MM-DD-XXX
**Files Modified:** List all changed files
**Performance Impact:** 1M user assessment  
**Database Changes:** Schema/index modifications
**Testing:** Unit/integration/load tests
**Rollback Plan:** How to revert changes
```

---

## 🚨 **EMERGENCY STOPS**

### **STOP IMMEDIATELY IF:**
- Performance degrades below 100ms
- Database queries lack proper indexes
- Frontend design patterns change
- API contracts break
- Error rates exceed 0.1%

---

## ✅ **QUICK VALIDATION**

```bash
# Before any deployment:
npm run test          # All tests pass
npm run build         # Build succeeds  
npm run lint          # No lint errors
npm run type-check    # TypeScript valid
```

---

## 📞 **ESCALATION**

| Issue Type | Contact |
|------------|---------|
| Architecture | Technical Lead |
| Performance | Performance Team |
| Database | Database Admin |
| Security | Security Team |

---

## 🎯 **SUCCESS FORMULA**

```typescript
const SUCCESS = 
  CONSISTENCY + 
  PERFORMANCE + 
  VALIDATION + 
  DOCUMENTATION + 
  TESTING;
```

---

**🤖 REMEMBER: When in doubt, ask first. Better safe than sorry!**

**📖 Full Rulebook: `/AI_AGENT_RULEBOOK.md`**
