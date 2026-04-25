# API Keys Setup Guide

This project supports multiple AI providers to balance cost, speed, and intelligence. By default, we recommend utilizing free-tier providers for initial development.

---

## 1. OpenRouter (Recommended Default)

*Aggregates multiple models (Claude, Llama, etc.). Includes free models.*

* **Account Creation:** Visit https://openrouter.ai/ and sign up.
* **Key Generation:** Go to **Keys** in your dashboard and click **Create Key**.

### `.env` Setup

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
```

---

## 2. Groq

*Incredibly fast inference for open-source models like Llama 3.*

* **Account Creation:** Visit https://console.groq.com/ and sign up.
* **Key Generation:** Navigate to **API Keys** and generate a new key.
* **Free Tier Notes:** Groq currently offers generous rate limits for developers.

### `.env` Setup

```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_...
```

---

## 3. Google Gemini

*Powerful multimodal capabilities.*

* **Account Creation:** Visit https://aistudio.google.com/
* **Key Generation:** Click **Get API Key** in the left-hand navigation.

### `.env` Setup

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza...
```

---

## 4. OpenAI

*Industry standard for GPT-4o / GPT-4 Turbo.*

* **Account Creation:** Visit https://platform.openai.com/
* **Key Generation:** Navigate to **API Keys** and create a new secret key.
* **Free Tier Notes:** Requires a funded account (prepaid) for API usage. No strictly free tier for new models.

### `.env` Setup

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```
