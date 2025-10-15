# Customizing Your Sentor ML Node

## 🎨 Changing the Logo/Icon

### Current Icons
Your node currently uses placeholder smiley face icons:
- `nodes/Sentor/sentor.svg` (light mode)
- `nodes/Sentor/sentor.dark.svg` (dark mode)

### How to Replace Icons

1. **Create Your Custom SVG Icons**
   - Light mode icon: 24x24px SVG
   - Dark mode icon: 24x24px SVG (with lighter colors for dark backgrounds)
   - Keep file sizes small (< 5KB recommended)
   - Use simple, recognizable designs

2. **Replace the Files**
   ```bash
   # Replace with your custom icons
   cp /path/to/your/sentor-light.svg nodes/Sentor/sentor.svg
   cp /path/to/your/sentor-dark.svg nodes/Sentor/sentor.dark.svg
   ```

3. **Icon Design Tips**
   - Use your Sentor brand colors
   - Make it recognizable at small sizes
   - Ensure good contrast for both light/dark modes
   - Test how it looks in n8n's node panel

4. **Rebuild After Changing Icons**
   ```bash
   npm run build
   ```

### SVG Icon Template

Here's a template if you want to create a custom icon:

**Light Mode (sentor.svg):**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" fill="none"/>
  <!-- Your custom icon paths here -->
  <!-- Use darker colors for light mode (#333, #666, etc.) -->
</svg>
```

**Dark Mode (sentor.dark.svg):**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="24" height="24" fill="none"/>
  <!-- Your custom icon paths here -->
  <!-- Use lighter colors for dark mode (#fff, #eee, etc.) -->
</svg>
```

## 📝 Updating Metadata

### Package Information (package.json)

Edit `/Users/erfan/workspace/sentor/n8n-nodes-sentor/package.json`:

```json
{
    "name": "n8n-nodes-sentor",
    "version": "0.1.0",  // Update version when publishing updates
    "description": "n8n community node for sentiment analysis using Sentor ML API",
    "homepage": "https://github.com/erfanjn/n8n-nodes-sentor",  // Your repo
    "keywords": [
        "n8n-community-node-package",
        "n8n",
        "sentiment-analysis",
        "sentor",
        "ml",
        "machine-learning",
        "nlp"
    ],  // Add more keywords for discoverability
    "author": {
        "name": "Erfan Jazeb Nikoo",
        "email": "erfan.jazebnikoo@gmail.com"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/erfanjn/n8n-nodes-sentor.git"  // Your GitHub repo
    }
}
```

### Node Display Information

Edit `nodes/Sentor/Sentor.node.ts`:

```typescript
displayName: 'Sentor ML',  // How it appears in n8n
name: 'sentor',  // Internal identifier (keep lowercase, no spaces)
icon: 'file:sentor.svg',  // Icon reference
group: ['transform'],  // Category: input, output, transform, trigger
version: 1,  // Node version
subtitle: '={{$parameter["operation"]}}',  // Shows operation in workflow
description: 'Analyze sentiment of text documents using Sentor ML',
```

### Credential Display Information

Edit `credentials/SentorApi.credentials.ts`:

```typescript
name = 'sentorApi';  // Internal identifier
displayName = 'Sentor API';  // How it appears in credentials list
documentationUrl = 'https://sentor.app/docs/#/';  // Link to your docs
```

## 🔧 Advanced Customization

### Adding More Operations

If you want to add more operations (e.g., batch analysis, entity extraction):

1. Add to the operations array in `Sentor.node.ts`:
```typescript
options: [
    {
        name: 'Predict Sentiment',
        value: 'predict',
        description: 'Analyze sentiment of text document',
        action: 'Predict sentiment of a document',
    },
    {
        name: 'Batch Analyze',  // New operation
        value: 'batchAnalyze',
        description: 'Analyze multiple documents at once',
        action: 'Batch analyze documents',
    },
]
```

2. Add corresponding logic in the `execute()` method

### Changing Node Category

In `Sentor.node.ts`, change the `group` property:
- `['input']` - Data input nodes
- `['output']` - Data output nodes
- `['transform']` - Data transformation (current)
- `['trigger']` - Workflow triggers

### Adding More Languages

In `Sentor.node.ts`, add to language options:
```typescript
options: [
    { name: 'English', value: 'en' },
    { name: 'Dutch', value: 'nl' },
    { name: 'German', value: 'de' },  // Add more
    { name: 'French', value: 'fr' },
]
```

## 📋 Pre-Publishing Checklist

Before publishing to npm:

- [ ] Custom icons are in place and look good
- [ ] package.json metadata is complete and accurate
- [ ] GitHub repository URL is correct
- [ ] Homepage URL is correct
- [ ] Documentation URL works
- [ ] Keywords are relevant for discoverability
- [ ] Version number follows semver (0.1.0 for first release)
- [ ] README.md is complete
- [ ] Code is tested locally
- [ ] `npm run build` completes successfully

## 🚀 After Customization

Always rebuild after making changes:

```bash
# Rebuild the package
npm run build

# Test locally before publishing
npm link
# Then link in your n8n installation
```

