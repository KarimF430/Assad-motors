# 🧠 RAG Implementation (Real & Robust)

Your AI now uses a **Hybrid RAG (Retrieval-Augmented Generation)** system.

## 1. How it Works
1.  **User Query:** "How is the Creta reliability?"
2.  **Retrieval (Dual-Mode):**
    *   **Primary:** Attempts to query **MongoDB** (Real Database) for live car data.
    *   **Fallback:** If DB is unreachable (current state), it seamlessly switches to a **Local Knowledge Base** (Detailed Mock Variants).
3.  **Web Intelligence:** Fetches real-world owner feedback (reviews, pros/cons) from the web scraper.
4.  **Generation:** Combines **Car Data + Web Insights + User Query** into a prompt for **Llama-3-70B**.
5.  **Response:** Generates a human-like, fact-based answer.

## 2. Code Structure
*   **`rag-system.ts`**: The core brain.
    *   `retrieveCarData()`: Handles MongoDB query with filters + Local Fallback.
    *   `retrieveWebData()`: Fetches owner reviews.
    *   `generateRAGResponse()`: Constructs the prompt and calls Hugging Face.
*   **`question-handler.ts`**: The router.
    *   Directs specific queries (Verdict, Performance) to **Expert Templates** (fast & accurate).
    *   Directs general/complex queries to **RAG System** (flexible & intelligent).

## 3. Why this is "Real AI"
*   It doesn't just guess; it **retrieves facts**.
*   It handles **database failures** gracefully (Self-Healing).
*   It combines **structured data** (Specs) with **unstructured data** (Reviews).

## 4. Test It
Go to [http://localhost:3001/ai-chat](http://localhost:3001/ai-chat) and ask:
*   "Tell me about Creta reliability" (Uses RAG + Web Data)
*   "Compare Creta and Seltos safety" (Uses RAG + Specs)
