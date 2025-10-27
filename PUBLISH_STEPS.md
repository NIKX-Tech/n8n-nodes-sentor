# Quick Publishing Guide

## The Fix
✅ Added credential test to `credentials/SentorApi.credentials.ts`
✅ Version bumped to `0.2.2`
✅ Build completed successfully
✅ Ready to publish

## Commands to Run

### 1. Stage and Commit Changes
```bash
cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
git add credentials/SentorApi.credentials.ts package.json CHANGELOG.md
git commit -m "fix: add credential test for n8n community node compliance

- Added credential test using /health endpoint
- Validates API key during credential setup in n8n
- Required for n8n automated review approval
- Version 0.2.2"
```

### 2. Push to GitHub
```bash
git push origin main
```

### 3. Publish to npm
```bash
npm publish
```

If you need to login to npm first:
```bash
npm login
```

### 4. Verify Publication
After publishing, verify at:
- https://www.npmjs.com/package/n8n-nodes-sentor
- Should show version 0.2.2

### 5. Resubmit to n8n
1. Go to your n8n community node submission page
2. Check the box: "I confirm that I have made the required changes to my package and published to npm"
3. Resubmit
4. The automated review should now pass ✅

## What the Fix Does

The credential test:
- Automatically validates API keys when users add them in n8n
- Uses the lightweight health check endpoint
- Provides immediate feedback (valid/invalid)
- Required by n8n for all community nodes
- Follows best practices from n8n Node Starter Kit

## Files Changed
- `credentials/SentorApi.credentials.ts` - Added test property
- `package.json` - Version 0.2.1 → 0.2.2
- `CHANGELOG.md` - Documented changes

## Note
The `dist/` folder is automatically built during `npm publish`, so you don't need to commit it to git.

