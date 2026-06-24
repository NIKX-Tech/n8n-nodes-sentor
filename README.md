<!-- markdownlint-disable MD033 -->
# n8n-nodes-sentor

<img src="https://raw.githubusercontent.com/NIKX-Tech/n8n-nodes-sentor/main/nodes/Sentor/sentor-v3.svg" width="70" alt="Sentor Logo">

**Official n8n community node for entity-based sentiment analysis powered by the Sentor AI API.**

[![npm](https://img.shields.io/npm/v/n8n-nodes-sentor?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/n8n-nodes-sentor)
[![License](https://img.shields.io/github/license/NIKX-Tech/n8n-nodes-sentor?style=flat-square&color=blue)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/NIKX-Tech/n8n-nodes-sentor?style=flat-square&color=yellow)](https://github.com/NIKX-Tech/n8n-nodes-sentor/stargazers)
<br>
[![Website](https://img.shields.io/badge/website-sentor.app-5546FA?style=flat-square&logo=google-chrome&logoColor=white)](https://sentor.app)
[![Dashboard](https://img.shields.io/badge/get%20api%20key-dashboard.sentor.app-5546FA?style=flat-square)](https://dashboard.sentor.app/settings?tab=api-access)
[![Docs](https://img.shields.io/badge/docs-sentor.app%2Fdocs-5546FA?style=flat-square)](https://sentor.app/docs)

Stop guessing why ratings drop. Sentor pinpoints exactly how customers feel about specific entities, brands, products, features, and competitors, using fine-tuned BERT models built for aspect-based sentiment analysis. Use this node to run sentiment predictions, clustering, and topic naming directly inside your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

---

## Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Operations](#-operations)
- [Credentials](#-credentials)
- [Rate Limits](#-rate-limits)
- [Resources](#-resources)

---

## 📦 Installation

### Community Nodes (Recommended)

1. Open your n8n instance and go to **Settings > Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-sentor` and click **Install**

### Manual / Self-Hosted

```bash
npm install n8n-nodes-sentor
```

Get a free API key at [dashboard.sentor.app](https://dashboard.sentor.app/settings?tab=api-access).

---

## 🚀 Quick Start

1. Add the **Sentor** node to your workflow
2. Create a **Sentor API** credential with your API key
3. Set the **Document Text** field (or use an expression to pull from a previous node)
4. Run the workflow, results come back with label, probability, and sentence-level details

---

## Operations

### Predict Sentiment

Analyzes the sentiment of one or more text documents. Supports English (`en`) and Dutch (`nl`).

| Parameter | Description |
|-----------|-------------|
| **Language** | `en` (English) or `nl` (Dutch) |
| **Document Text** | The text to analyze, supports n8n expressions |
| **Entities** | Optional comma-separated list of entities to focus on (e.g. `Apple, iPhone, price`) |
| **Simplify Output** | Returns a flat `{ label, probability, details }` object when enabled (default: on) |

**Example output (simplified):**

```json
{
  "predicted_label": "positive",
  "predicted_class": 1,
  "probability": 0.95,
  "details": [
    { "sentence": "The camera is amazing.", "sentiment": "positive", "score": 0.97 }
  ]
}
```

### Batch Processing

When multiple items flow into the node, it collects them into a single API request and maps each result back to its source item. No extra configuration needed.

### Topic Naming (via Google Gemini)

Attach an optional **Google Gemini API** credential to enable AI-generated topic names for your sentiment clusters.

---

## Credentials

### Sentor API (required)

1. Go to [dashboard.sentor.app](https://dashboard.sentor.app/settings?tab=api-access) and copy your API key
2. In n8n: **Credentials > New > Sentor API**
3. Paste your key and save

### Google Gemini API (optional)

Required only for the topic naming operation.

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. In n8n: **Credentials > New > Google Gemini API**
3. Paste your key and save

---

## Rate Limits

| Plan | Requests/min | Requests/day | Requests/month |
|------|-------------|--------------|----------------|
| Free | 5 | 100 | 1,000 |
| Starter | 60 | 1,000 | 10,000 |
| Growth | 200 | 3,000 | 30,000 |
| Business | 500 | 10,000 | 100,000 |
| Enterprise | Custom | Custom | Custom |

See [pricing](https://sentor.app/pricing) for full plan details.

---

## Resources

- [Sentor Website](https://sentor.app)
- [API Documentation](https://sentor.app/docs/guides/quickstart)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Issues](https://github.com/NIKX-Tech/n8n-nodes-sentor/issues)

---

## License

[MIT](LICENSE)
