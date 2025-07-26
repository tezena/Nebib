# Environment Configuration

## Local Development Setup

Create a `.env` file in your project root with the following variables:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=VLXuel6RHytCGP2FA3fUPBY4Eu8vkvfb

# Database Configuration
DATABASE_URL=postgresql://postgres:URazqrynAMopMcJVLtiWzDhikLOlsMqd@mainline.proxy.rlwy.net:15858/railway

# Next.js Configuration
NODE_ENV=development

# Optional: Custom API URL (for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Port Configuration (for local development)
PORT=3000
```

## Railway Deployment

For Railway deployment, set these environment variables in your Railway project:

### Required Variables:
- `BETTER_AUTH_SECRET=VLXuel6RHytCGP2FA3fUPBY4Eu8vkvfb`
- `NODE_ENV=production`

### Optional Variables:
- `NEXT_PUBLIC_API_URL=https://nebib-production.up.railway.app`

## How to Create .env File

### Method 1: Manual Creation
1. Create a new file named `.env` in your project root
2. Copy the content above into the file
3. Save the file

### Method 2: Using Terminal
```bash
# Create .env file
cat > .env << 'EOF'
# Better Auth Configuration
BETTER_AUTH_SECRET=VLXuel6RHytCGP2FA3fUPBY4Eu8vkvfb

# Database Configuration
DATABASE_URL=postgresql://postgres:URazqrynAMopMcJVLtiWzDhikLOlsMqd@mainline.proxy.rlwy.net:15858/railway

# Next.js Configuration
NODE_ENV=development

# Optional: Custom API URL (for local development)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Port Configuration (for local development)
PORT=3000
EOF
```

### Method 3: Using VS Code
1. Right-click in the project root
2. Select "New File"
3. Name it `.env`
4. Paste the content above

## Security Notes

- **Never commit `.env` files** to version control
- **Use different secrets** for development and production
- **Keep secrets secure** and don't share them publicly
- **Rotate secrets regularly** for better security

## Troubleshooting

### Common Issues:

1. **"BETTER_AUTH_SECRET not found"**
   - Make sure `.env` file exists in project root
   - Check that the variable name is correct
   - Restart your development server

2. **Database connection issues**
   - Verify DATABASE_URL is correct
   - Check if database is accessible
   - Ensure network connectivity

3. **Port already in use**
   - Change PORT in .env file
   - Kill existing processes on port 3000
   - Use `lsof -i :3000` to find processes 