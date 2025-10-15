# n8n-nodes-sentor

This is an n8n community node that lets you perform sentiment analysis using the [Sentor ML API](https://sentor.app) in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install a community node**
3. Enter `n8n-nodes-sentor` in the npm package name field
4. Click **Install**

### Manual Installation

To get started with local development or manual installation:

```bash
npm install n8n-nodes-sentor
```

## Operations

The Sentor ML node currently supports the following operation:

### Document > Predict Sentiment

Analyzes the sentiment of text documents and returns:
- Predicted label (positive, negative, or neutral)
- Confidence probabilities for each sentiment
- Sentence-level sentiment details

## Configuration

### Credentials

You need a Sentor ML API key to use this node:

1. Get your API key from [Sentor ML](https://sentor.app)
2. In n8n, go to **Credentials > New**
3. Search for "Sentor API"
4. Enter your API key
5. Click **Save**

### Node Parameters

- **Language**: Choose between English (en) or Dutch (nl)
- **Document Text**: The text content to analyze (supports expressions for dynamic input)
- **Entities** (optional): Comma-separated list of entities to analyze within the text (e.g., "company, product, service")
- **Simplify Output**: When enabled (default), returns a simplified JSON structure with just label, probability, and details. When disabled, returns the full API response.

## Example Usage

### Basic Sentiment Analysis

**Input:**
```json
{
  "documentText": "I love this product! It works great.",
  "language": "en"
}
```

**Output (simplified):**
```json
{
  "label": "positive",
  "probability": 0.95,
  "details": [
    {
      "sentence": "I love this product!",
      "sentiment": "positive",
      "score": 0.97
    },
    {
      "sentence": "It works great.",
      "sentiment": "positive",
      "score": 0.93
    }
  ]
}
```

### With Entities

**Input:**
```json
{
  "documentText": "Apple's new iPhone is expensive but the camera quality is amazing.",
  "language": "en",
  "entities": "Apple, iPhone, camera"
}
```

The API will provide sentiment analysis with special attention to the specified entities.

## Batch Processing

This node supports batch processing. When you pass multiple items to the node, it will:
1. Collect all input items
2. Send them in a single batch request to the API
3. Return individual results mapped to each input item

This is more efficient than processing items one by one.

## Compatibility

- Tested with n8n version 1.0.0+
- Requires an active Sentor ML API subscription

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Sentor ML Homepage](https://sentor.app)
* [Sentor ML API Documentation](https://sentor.app/docs/#/)
* [GitHub Repository](https://github.com/NIKX-Tech/n8n-nodes-sentor)

## Version History

### 0.1.0
- Initial release
- Support for sentiment prediction
- English and Dutch language support
- Entity-based analysis
- Batch processing support

## License

[MIT](LICENSE)

## Support

For issues, questions, or contributions:
- GitHub Issues: [https://github.com/NIKX-Tech/n8n-nodes-sentor/issues](https://github.com/NIKX-Tech/n8n-nodes-sentor/issues)
- Email: erfan@nikx.one

## Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/NIKX-Tech/n8n-nodes-sentor.git
cd n8n-nodes-sentor
```

2. Install dependencies:
```bash
npm install
```

3. Build the node:
```bash
npm run build
```

4. Test locally:
```bash
npm run dev
```

This will start n8n with your local node loaded. You can then test it in your workflows.

### Testing

To test the node in a local n8n instance:

1. Link the package locally:
```bash
npm link
```

2. In your n8n installation directory:
```bash
npm link n8n-nodes-sentor
```

3. Restart n8n and the node will be available

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
