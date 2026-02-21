Below is a **refined, professional, GitHub-ready version** of your document — cleaner, more structured, and more enterprise-grade while keeping everything you wrote.

I optimized:

✔ Headings
✔ Grammar & clarity
✔ Technical descriptions
✔ Developer friendliness
✔ GitHub formatting
✔ Removed duplication
✔ Added better section hierarchy

---

# 🚗 Killerwhale – Project Technical Documentation

**Production-ready car discovery platform for the Indian automotive market**

---

# 📘 Overview

Killerwhale is a **high-performance, enterprise-grade car discovery platform** built for India. It features AI-powered search, real-time pricing data, dynamic comparisons, and a complete admin CMS. The platform is optimized for:

* **1M+ daily users**
* **95%+ mobile traffic**
* **Sub-10ms API response times**
* **99.9% uptime SLA**

---

# 🎯 Core Purpose

Deliver the most comprehensive, fast, and intuitive platform for Indian car buyers to discover, compare, and make informed decisions about new car purchases.

---

# 🏗️ Technology Stack

## 🌐 Frontend (User Interface)
The client-side application is built for high-performance, SEO, and interactivity.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | The core React framework using the modern App Router architecture. |
| **Language** | **TypeScript** | Ensures type safety and cleaner code across the entire app. |
| **Styling** | **Tailwind CSS 3.3** | Utility-first CSS framework for rapid UI development. |
| **Animations** | **Framer Motion** | Smooth transitions and complex animations. |
| **Icons** | **Lucide React** | Lightweight, consistent SVG icons. |
| **Graphics** | **Lottie Files** | Detailed, scalable vector animations (e.g., loading states). |
| **State/Utils** | `clsx`, `tailwind-merge` | Utilities for dynamic class name conditional logic. |
| **Analytics** | **Vercel Analytics** | Real-time traffic and performance monitoring. |
| **Tracking** | **Amplitude** | User behavior tracking and product analytics. |
| **Error Tracking** | **Sentry** | Frontend error logging and performance tracing. |

## ⚙️ Backend (API & Logic)
A robust Node.js server handling data, AI processing, and authentication.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | **Node.js** | JavaScript runtime environment. |
| **Framework** | **Express.js** | Fast, unopinionated web framework for APIs. |
| **Language** | **TypeScript** | Executed using `tsx` for modern ESM support. |
| **Database (Primary)** | **MongoDB** | NoSQL database for flexible car data and user logs (via `mongoose`). |
| **Database (Relational)**| **PostgreSQL** | *Migrated/Hybrid usage* (connected via `drizzle-orm`). |
| **Caching** | **Redis** | High-performance in-memory caching (via `ioredis`). |
| **Authentication** | **Passport.js** | Handles Google OAuth and Local (Email/Pass) login strategies. |
| **Security** | `helmet`, `bcryptjs`, `cors` | Headers security, password hashing, and cross-origin policies. |
| **Validation** | **Zod** | TypeScript-first schema validation for API inputs. |
| **File Uploads** | `multer`, `sharp` | Handling multipart form data and image processing/optimization. |

## 🤖 Artificial Intelligence (AI)
The "Killer Whale" brain powering the intelligent features.

| Technology | Purpose |
| :--- | :--- |
| **Groq SDK** | Ultra-fast inference for LLM queries (Llama 3 models). |
| **HuggingFace Inference**| Access to open-source models for specific tasks. |
| **MCP SDK** | Model Context Protocol for agentic workflows and tool use. |
| **RAG System** | Custom Retrieval-Augmented Generation for accurate car answers. |

## ☁️ Infrastructure & DevOps
Tools used to deploy, host, and monitor the application.

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Host** | **Vercel** | Hosting Next.js app, Edge Functions, and Image Optimization. |
| **Backend Host** | **Render** | Hosting the Node.js API and Background Workers. |
| **Storage** | **Cloudflare R2** | (AWS S3 Compatible) Object storage for car images. |
| **CDN/DNS** | **Cloudflare** | DNS management, caching, and DDoS protection. |
| **Containerization**| **Docker** | Containerizing the backend for consistent deployment. |
| **Monitoring** | **Grafana & Prometheus** | Real-time metrics visualization and alerting (Self-hosted). |

## 🧪 Testing & Quality Assurance
Ensuring reliability before every release.

| Technology | Purpose |
| :--- | :--- |
| **Jest** | Unit testing framework for logic and API routes. |
| **Playwright** | End-to-End (E2E) browser testing for user flows. |
| **K6** | Load testing tool to simulate high traffic volume. |
| **Google Lighthouse** | Performance, Accessibility, and BEST PRACTICES auditing. |

## 📈 SEO & Growth tools
| Technology | Output |
| :--- | :--- |
| **Sitemap.xml** | Dynamic, automatically generated map of all 50,000+ car pages. |
| **Schema.org** | JSON-LD Structured data for Rich Snippets (Product, Breadcrumb). |
| **Robots.txt** | Directives for Googlebot crawling behavior. |

---

# ✨ Key Features

## **User-Facing**

### 1. Car Discovery

* 36+ brands, 1000+ models, 5000+ variants
* Advanced filtering (fuel, transmission, budget, seating, body type)
* AI-powered search
* Monthly real-time pricing

### 2. Comparisons

* Compare up to 4 cars
* Variant-level comparison
* Real-time spec updates

### 3. Price Tools

* EMI calculator
* On-road price breakdown
* City selection

### 4. Content

* News, reviews, launches
* YouTube video integration with caching
* FAQ pages
* User rating system

## **Admin Dashboard**

* Brand/Model/Variant management
* Full CMS for news
* CSV bulk importer
* User roles (Admin/Editor/Viewer)
* Analytics dashboard

## **AI Features**

* Floating AI assistant across pages
* Context-aware car recommendations
* AI-powered natural language search
* Smart price/spec queries

---

# 🚀 Performance Metrics

| Metric             | Value  | Status        |
| ------------------ | ------ | ------------- |
| API Response Time  | 5–10ms | ✅ Excellent   |
| MongoDB Query Time | 5–10ms | ✅ Excellent   |
| LCP                | <2s    | ✅ Optimized   |
| Cache Hit Rate     | 95%    | ✅ High        |
| Uptime SLA         | 99.9%  | 🚀 Production |
| Concurrent Users   | 100K+  | ⚡ Scalable    |

---

# 🔒 Security Architecture

* **JWT authentication** (24h expiry)
* **Rate limiting** (60 req/min, 5 login attempts / 15 min)
* **XSS, CSRF & NoSQL injection protection**
* **CSP, HSTS, X-Frame-Options** headers
* **File validation + malware-safe uploads**
* **Password hashing (bcrypt, 10 rounds)**
* **Strict CORS allowlist**

---

# 📊 Database Architecture

### Core Collections

* `brands`
* `models`
* `variants`
* `news`
* `users`
* `comparisons`

### Optimizations

* **27 compound indexes** (10× faster queries)
* **Connection pooling** (100 concurrent connections)
* **N+1 query elimination**
* **Cascade deletes for data integrity**

---

# 🎨 Design System

### Mobile-First

* Optimized for 95% mobile users
* 44px+ tap targets
* Lazy-loaded images
* Responsive typography

### Color System

* **Primary:** Red-Orange Gradient (#DC2626 → #EA580C)
* **Neutral:** Gray scale
* **Success:** Green
* **Warning:** Orange
* **Error:** Red

---

# 🛠️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites

*   **Node.js 20+**
*   **MongoDB** (Local or Atlas)
*   **Redis** (Local or Cloud)
*   **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/KarimF430/Killer-Whale.git
cd Killer-Whale
```

### 2. Backend Setup

The backend runs on port `5001`.

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Start Development Server
npm run dev
```

**Required Backend Environment Variables (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/gadizone
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 3. Frontend Setup

The frontend runs on port `3000`.

```bash
# In the root directory
npm install

# Create .env.local file
cp .env.example .env.local

# Start Development Server
npm run dev
```

**Required Frontend Environment Variables (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
GOOGLE_MAPS_API_KEY=your_key (Optional for maps)
```

### 4. Verify Installation

*   **Frontend:** Visit `http://localhost:3000`
*   **Backend Health Check:** Visit `http://localhost:5001/health`
*   **Admin Panel:** Visit `http://localhost:3000/admin/login`

---

# 🗺️ Project Sitemap & Routes

The application is structured into several key domains:

### 🏠 Core Pages
*   `/` - **Homepage** (ISR)
*   `/login`, `/signup` - **Authentication**
*   `/about-us`, `/contact-us` - **Static Pages**
*   `/privacy-policy`, `/terms-and-conditions` - **Legal**

### 🚗 Car Discovery
*   `/[brand-cars]` - **Brand Page** (e.g., `/tata-cars`)
*   `/[brand-cars]/[model]` - **Model Page** (e.g., `/tata-cars/nexon`)
*   `/[brand-cars]/[model]/[variant]` - **Variant Details**
*   `/search` - **Global Search**
*   `/compare/[car1-vs-car2]` - **Comparisons**
*   `/emi-calculator` - **Financial Tools**
*   `/fuel-cost-calculator` - **Utility Tools**
*   `/location/dealers` - **Dealer Locator**

### 🔍 Specialized SEO Landing Pages
*   `/best-cars-under-[price]` - **Budget Pages** (8L, 10L, 20L, etc.)
*   `/electric-cars` - **EV Hub**
*   `/upcoming-cars-in-india` - **Launches**
*   `/new-car-launches-in-india` - **Latest News**
*   `/popular-cars-in-india` - **Trending**
*   `/top-selling-cars-in-india` - **Sales Data**

### 🛡️ Admin & Dashboard
*   `/admin` - **Dashboard Home**
*   `/admin/brands` - **Manage Brands**
*   `/admin/models` - **Manage Models**
*   `/admin/reviews` - **User Reviews Moderation**
*   `/admin/news` - **Content Management System**

---

# 🚀 Deployment Guide

### Frontend (Vercel)
1.  Push code to GitHub.
2.  Import project into **Vercel**.
3.  Set "Framework Preset" to **Next.js**.
4.  Add Environment Variables from `.env.local`.
5.  Deploy.

### Backend (Render / Railway)
1.  Create a new Web Service.
2.  Connect GitHub Repository.
3.  Set **Root Directory** to `backend`.
4.  Set **Build Command:** `npm install && npm run build`.
5.  Set **Start Command:** `npm start`.
6.  Add Environment Variables.

---

# 🧪 Testing

### Unit Tests

* Components
* Utils
* API handlers

### Integration Tests

* Auth
* APIs
* Database workflows

### Performance Tests

* Load testing (k6)
* Query benchmarks
* Cache performance

---

# 🎯 Roadmap

### Phase 1 – Completed

* Core platform
* AI-based search
* 5000+ variants indexed
* Complete CMS
* Production deployment

### Phase 2 – Planned

* Push notifications
* Dealer integrations
* Lead management
* Advanced analytics

### Phase 3 – Future

* Mobile apps
* AR visualization
* Virtual showroom
* Finance + insurance integrations

---

# 📊 Status

**🚀 100% Production Ready**
Fully optimized, monitored, and scaled for **1M+ daily users**.

---

# 👥 Team Responsibilities

* Full-Stack Development
* Database Architecture
* UI/UX
* DevOps & Infrastructure
* QA & Automation

---

# 🔗 Repository & Docs

* **GitHub:** [https://github.com/KarimF430/Killer-Whale](https://github.com/KarimF430/Killer-Whale)
* **Documentation:** `README.md` + internal docs
