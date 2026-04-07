# 🚀 Redis Caching & Rate Limiting Demo

A simple Node.js project demonstrating **Redis-based caching** and **Sliding Window Rate Limiting** using a Fastify API.

This project focuses on improving API performance and protecting endpoints from abuse using practical backend techniques.

---

## 📌 What This Project Demonstrates

* ⚡ Fastify REST API
* 🧠 Redis caching for performance optimization
* 🚦 Sliding Window Rate Limiting
* 🌐 Global rate limiting across all routes
* 🔐 Route-specific rate limiting for sensitive endpoints
* 📊 Controlled request flow using Redis

---

## 🧠 Core Concepts

### 🔹 Redis Caching

To avoid repeated external API calls, responses are cached in Redis.

**Flow:**

1. Request comes in
2. Check Redis for cached data
3. If cache exists → return instantly
4. If not:

   * Fetch data
   * Store in Redis with TTL
   * Return response

👉 This significantly reduces latency and improves performance.

---

### 🔹 Sliding Window Rate Limiting

This project uses a **sliding window algorithm** for more accurate rate limiting.

**How it works:**

* Each request is stored with a timestamp in Redis
* Old requests outside the time window are removed
* Only valid requests within the window are counted
* If limit is exceeded → request is blocked

👉 Compared to fixed window, this avoids burst abuse and is more precise.

---

### 🔹 Global Rate Limiting

* Applied to all incoming requests
* Prevents overall API abuse
* Ensures fair usage across clients

---

### 🔹 Route-Specific Rate Limiting

* Applied only to critical endpoints (e.g., login)
* Uses stricter limits than global middleware
* Helps prevent brute-force attacks

---

## ⚙️ Example Scenario

### Without Rate Limiting

```text
User → Unlimited requests → Server overload 
```

### With Rate Limiting

```text
User → Limited requests → Controlled traffic 
```

---

### Without Caching

```text
Client → API → External API → Response (slow)
```

### With Caching

```text
Client → API → Redis → Response (fast)
```

---

## 🛠️ Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start Redis locally

Make sure Redis is running on default port:

```bash
redis-server
```

### 3. Run the server

```bash
node server.js
```

---

## 📊 Rate Limiting Strategy (Example)

* Limit: 5 requests
* Window: 60 seconds

This ensures:

* Smooth traffic handling
* No sudden request bursts
* Better API stability

---

## 🎯 Use Cases

* Login protection (prevent brute force)
* Public API protection
* Backend performance optimization
* Real-world rate limiting implementation

---

## ⭐ Final Note

This is a **practice-focused implementation** designed to understand how caching and rate limiting work together to build **efficient and reliable APIs**.

---
