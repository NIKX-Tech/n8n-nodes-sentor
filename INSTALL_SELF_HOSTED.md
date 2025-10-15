# Installing on Self-Hosted n8n (n8n.nikx.one)

## Before Publishing (Testing Locally)

Since you have a self-hosted n8n instance, you have several options to test your node before publishing to npm.

## Option 1: Install via Community Nodes UI (After Publishing)

**EASIEST - But requires npm publish first**

1. Publish to npm (instructions below)
2. Go to your n8n instance: https://n8n.nikx.one
3. Navigate to: **Settings → Community Nodes**
4. Click **"Install a community node"**
5. Enter: `n8n-nodes-sentor`
6. Click **Install**
7. Restart n8n (if needed)

## Option 2: Manual Installation on Server (For Testing Before Publishing)

### If your n8n is installed with npm/directly:

1. **Build your node locally:**
   ```bash
   cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
   npm run build
   ```

2. **Create a tarball:**
   ```bash
   npm pack
   # This creates: n8n-nodes-sentor-0.1.0.tgz
   ```

3. **Upload to your server:**
   ```bash
   scp n8n-nodes-sentor-0.1.0.tgz user@n8n.nikx.one:/path/to/n8n/
   ```

4. **SSH into your server:**
   ```bash
   ssh user@n8n.nikx.one
   ```

5. **Install the node:**
   ```bash
   cd /path/to/n8n/  # Usually ~/.n8n or your n8n installation directory
   npm install /path/to/n8n-nodes-sentor-0.1.0.tgz
   ```

6. **Restart n8n:**
   ```bash
   # If using systemd:
   sudo systemctl restart n8n
   
   # If using pm2:
   pm2 restart n8n
   
   # If running directly:
   # Stop and start n8n
   ```

### If your n8n is running in Docker:

1. **Build your node locally:**
   ```bash
   cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
   npm run build
   npm pack
   ```

2. **Method A - Add to Docker container:**
   
   Update your `docker-compose.yml` or Docker run command to mount the package:
   
   ```yaml
   version: '3'
   services:
     n8n:
       image: n8nio/n8n
       volumes:
         - n8n_data:/home/node/.n8n
         - ./n8n-nodes-sentor-0.1.0.tgz:/tmp/node-package.tgz
       environment:
         - N8N_CUSTOM_EXTENSIONS=/tmp
       # ... other config
   ```

3. **Method B - Install inside container:**
   
   ```bash
   # Copy tarball to container
   docker cp n8n-nodes-sentor-0.1.0.tgz n8n_container:/tmp/
   
   # Execute install in container
   docker exec -it n8n_container sh
   cd /home/node/.n8n
   npm install /tmp/n8n-nodes-sentor-0.1.0.tgz
   exit
   
   # Restart container
   docker restart n8n_container
   ```

## Option 3: Clone and Link (Development Mode)

If you have access to your server and want to develop/test:

1. **On your server:**
   ```bash
   cd /path/to/
   git clone https://github.com/erfanjn/n8n-nodes-sentor.git
   cd n8n-nodes-sentor
   npm install
   npm run build
   npm link
   ```

2. **Link to n8n:**
   ```bash
   cd ~/.n8n  # or your n8n installation directory
   npm link n8n-nodes-sentor
   ```

3. **Restart n8n**

## Recommended Workflow

### For Testing (Before Publishing):

1. ✅ **Build locally:**
   ```bash
   cd /Users/erfan/workspace/sentor/n8n-nodes-sentor
   npm run build
   npm pack
   ```

2. ✅ **Upload and install on your server** (use Option 2 above)

3. ✅ **Test thoroughly:**
   - Create test workflows
   - Test with real API calls
   - Verify all features work
   - Check error handling

### For Production (After Testing):

1. ✅ **Publish to npm:**
   ```bash
   npm login
   # Note: Use 'npm run build' instead of 'npm run release' to avoid the error
   npm run build
   npm version 0.1.0  # Set version if needed
   npm publish
   ```

2. ✅ **Install via n8n Community Nodes UI** (Option 1 above)

3. ✅ **Submit to n8n for verification:**
   Visit: https://n8n.io/creators/submit

## Quick Install Command (After Publishing)

Once published to npm, anyone can install with:

```bash
# On self-hosted n8n
npm install n8n-nodes-sentor
# Then restart n8n
```

Or use the Community Nodes UI in n8n settings.

## Verifying Installation

1. **Check the node appears:**
   - Open your n8n instance
   - Click the "+" to add a node
   - Search for "Sentor ML"
   - It should appear in the list

2. **Check credentials work:**
   - Go to Credentials → New
   - Search for "Sentor API"
   - Add your API key
   - Click "Test" to verify connection

3. **Test a workflow:**
   - Create a new workflow
   - Add Manual Trigger
   - Add Sentor ML node
   - Configure with test text
   - Execute and check results

## Troubleshooting

### Node doesn't appear after install:
```bash
# Check if package is installed
npm list n8n-nodes-sentor

# Restart n8n completely
sudo systemctl restart n8n  # or pm2 restart n8n
```

### Permission issues:
```bash
# If using npm globally, you might need sudo
sudo npm install n8n-nodes-sentor

# Or fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Docker-specific issues:
```bash
# Check container logs
docker logs n8n_container

# Verify package is installed inside container
docker exec n8n_container npm list n8n-nodes-sentor
```

## Getting Your Server Details

To help you with the installation, you'll need to know:

1. **How is n8n installed?**
   - npm/yarn global install?
   - Docker container?
   - Docker Compose?
   - Manual installation?

2. **Where is n8n located?**
   ```bash
   # Find n8n installation
   which n8n
   # Usually: ~/.n8n for data
   ```

3. **How do you restart n8n?**
   - systemd: `sudo systemctl restart n8n`
   - pm2: `pm2 restart n8n`
   - Docker: `docker restart n8n_container`

If you need help with your specific setup, let me know your n8n installation method!


