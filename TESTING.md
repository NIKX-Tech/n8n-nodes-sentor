# Testing Your n8n-nodes-sentor Package

## Method 1: Link to Local n8n (Recommended)

### Step 1: Build Your Node
```bash
cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
npm run build
```

### Step 2: Link the Package
```bash
npm link
```

### Step 3: Install in n8n
If you have n8n installed globally:
```bash
cd ~/.n8n
npm link n8n-nodes-sentor
```

If you're running n8n via npx or in a Docker container, you'll need to use Method 2.

### Step 4: Restart n8n
```bash
n8n start
```

Your Sentor ML node should now appear in the n8n nodes panel!

## Method 2: Test with Docker (Easiest)

### Step 1: Build Your Node
```bash
cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
npm run build
```

### Step 2: Create a Test Directory
```bash
mkdir ~/n8n-test
cd ~/n8n-test
```

### Step 3: Create package.json
```bash
cat > package.json << 'EOF'
{
  "name": "n8n-test",
  "version": "1.0.0",
  "dependencies": {
    "n8n": "latest"
  }
}
EOF
```

### Step 4: Link Your Node
```bash
npm install
npm link n8n-nodes-sentor
```

### Step 5: Start n8n
```bash
npx n8n start
```

Visit http://localhost:5678 and your node will be available!

## Method 3: Manual Installation (For Testing Published Packages)

After publishing to npm:
```bash
npm install n8n
npm install n8n-nodes-sentor
n8n start
```

## Testing Checklist

Once n8n is running:

1. ✅ **Find the Node**: Look for "Sentor ML" in the nodes panel
2. ✅ **Add Credentials**: 
   - Go to Credentials > Add Credential
   - Search for "Sentor API"
   - Add your API key
   - Test the connection
3. ✅ **Create a Test Workflow**:
   - Add a Manual Trigger node
   - Add the Sentor ML node
   - Configure it with test text
   - Execute and verify the output
4. ✅ **Test Features**:
   - Different languages (en/nl)
   - With and without entities
   - Simplify output toggle
   - Batch processing (multiple input items)

## Example Test Workflow

```json
{
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "documentText": "This product is amazing! I love it.",
        "language": "en",
        "entities": "product"
      },
      "name": "Sentor ML",
      "type": "n8n-nodes-sentor.sentor",
      "credentials": {
        "sentorApi": {
          "id": "1",
          "name": "Sentor API"
        }
      },
      "position": [450, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "Sentor ML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Troubleshooting

### Node Doesn't Appear
- Restart n8n completely
- Check that `npm run build` completed successfully
- Verify `dist/` folder contains your compiled files
- Check n8n logs for errors

### Credential Test Fails
- Verify your API key is correct
- Check that the API endpoint is accessible
- Look at network requests in browser dev tools

### Runtime Errors
- Check the n8n console/logs for error messages
- Verify your API base URL is correct
- Test the API endpoint directly with curl/Postman

