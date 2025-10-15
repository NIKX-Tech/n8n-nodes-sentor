# Publishing to npm - Step by Step Guide

## The Problem You Encountered

The `npm publish` and `npm run release` commands are failing due to Node.js version compatibility issues with the n8n build tools. Your Node.js v18.17.0 doesn't support some newer ES Module features.

## Solution: Manual Publishing Process

Since the automated release tools have compatibility issues, here's the **manual publishing process** that works:

### Step 1: Prepare Your Package

```bash
cd /Users/erfan/workspace/sentor/n8n-nodes-sentor

# Make sure everything is built
npm run build

# Verify build succeeded
ls -la dist/
```

### Step 2: Update Version (Optional)

Edit `package.json` and set your version:
```json
{
  "version": "0.1.0"  // or "1.0.0" for first stable release
}
```

### Step 3: Create a .npmignore File

This ensures only necessary files are published:

```bash
cat > .npmignore << 'EOF'
# Source files (only publish dist/)
nodes/
credentials/
*.ts
tsconfig.json
tsconfig.tsbuildinfo

# Development files
node_modules/
.git/
.github/
.DS_Store

# Test and docs (optional - you might want to keep README.md)
TESTING.md
CUSTOMIZATION.md
INSTALL_SELF_HOSTED.md
PUBLISHING.md

# Build artifacts
*.log
npm-debug.log*
.npmrc
EOF
```

### Step 4: Test What Will Be Published

```bash
# See what files will be included
npm pack --dry-run

# Or create actual tarball for testing
npm pack
# This creates n8n-nodes-sentor-0.1.0.tgz
```

### Step 5: Login to npm

```bash
npm login
# Enter your npm username, password, and email
```

If you don't have an npm account yet:
1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email
4. Then run `npm login`

### Step 6: Publish (Bypass the Broken Scripts)

**Option A - Remove prepublishOnly temporarily:**

```bash
# Backup package.json
cp package.json package.json.backup

# Edit package.json and remove the prepublishOnly script
# Change:
#   "prepublishOnly": "n8n-node prerelease"
# To:
#   "prepublishOnly": "echo 'Skipping prerelease check'"

# Then publish
npm publish

# Restore package.json
mv package.json.backup package.json
```

**Option B - Use --ignore-scripts flag (Recommended):**

```bash
# This bypasses all scripts including prepublishOnly
npm publish --ignore-scripts
```

**Option C - Manual version bump and publish:**

```bash
# Update version in package.json manually
npm version 0.1.0 --no-git-tag-version

# Publish with scripts ignored
npm publish --ignore-scripts
```

### Step 7: Verify Publication

```bash
# Check if package is live on npm
npm view n8n-nodes-sentor

# Or visit:
# https://www.npmjs.com/package/n8n-nodes-sentor
```

## After Publishing

### 1. Test Installation

On your server or locally:
```bash
npm install n8n-nodes-sentor
```

### 2. Submit to n8n for Verification

Visit: https://n8n.io/creators/submit

Provide:
- **Package name:** n8n-nodes-sentor
- **npm URL:** https://www.npmjs.com/package/n8n-nodes-sentor
- **GitHub URL:** https://github.com/erfanjn/n8n-nodes-sentor
- **Description:** Community node for sentiment analysis using Sentor ML API

### 3. Install on Your Self-Hosted Instance

Go to https://n8n.nikx.one:
1. Settings → Community Nodes
2. Install a community node
3. Enter: `n8n-nodes-sentor`
4. Install and restart

## Publishing Updates

When you make changes and want to publish an update:

```bash
# 1. Make your changes
# 2. Update version in package.json (follow semver)
#    - Patch (0.1.0 → 0.1.1): Bug fixes
#    - Minor (0.1.0 → 0.2.0): New features, backward compatible
#    - Major (0.1.0 → 1.0.0): Breaking changes

# 3. Rebuild
npm run build

# 4. Publish
npm publish --ignore-scripts
```

## Alternative: Fix Node.js Version (Long-term)

To use the official n8n-node release tools, upgrade Node.js:

```bash
# Check current version
node --version  # You have v18.17.0

# Upgrade to Node.js 20+ using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install 20
nvm use 20

# Then the official commands will work:
npm run release
```

But for now, **Option B above** (`npm publish --ignore-scripts`) is the quickest way to get published!

## Publishing Checklist

Before running `npm publish`:

- [ ] `npm run build` completes successfully
- [ ] Test the package locally (`npm pack` and test the .tgz)
- [ ] Version number is correct in package.json
- [ ] README.md is complete and accurate
- [ ] Icons are finalized
- [ ] All URLs (homepage, repository, docs) are correct
- [ ] You're logged in to npm (`npm whoami`)
- [ ] Package name is available (`npm view n8n-nodes-sentor` should show error if new)

## Quick Publish Command

The simplest working command for your situation:

```bash
cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
npm run build
npm publish --ignore-scripts
```

That's it! 🚀


