# Monorepo Configuration for AWS Deployment

## Common Monorepo Structures

### 1. Apps Directory Structure
```
your-monorepo/
├── apps/
│   ├── web/          # Your Next.js app
│   ├── admin/        # Admin panel
│   └── mobile/       # Mobile app
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared utilities
│   └── types/        # Shared TypeScript types
├── package.json
└── turbo.json        # Turborepo config
```

### 2. Packages Directory Structure
```
your-monorepo/
├── packages/
│   ├── web/          # Your Next.js app
│   ├── admin/        # Admin panel
│   └── shared/       # Shared packages
├── package.json
└── lerna.json        # Lerna config
```

### 3. Root Level Structure
```
your-monorepo/
├── frontend/         # Your Next.js app
├── backend/          # Backend API
├── shared/           # Shared code
├── package.json
└── docker-compose.yml
```

## Configuration for Different Structures

### For `apps/web` Structure

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd apps/web
        - npm ci
    build:
      commands:
        - cd apps/web
        - npm run build
  artifacts:
    baseDirectory: apps/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - apps/web/node_modules/**/*
      - apps/web/.next/cache/**/*
```

**Dockerfile:**
```dockerfile
# ... existing code ...
WORKDIR /app/apps/web
# ... rest of the file ...
```

### For `packages/web` Structure

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd packages/web
        - npm ci
    build:
      commands:
        - cd packages/web
        - npm run build
  artifacts:
    baseDirectory: packages/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - packages/web/node_modules/**/*
      - packages/web/.next/cache/**/*
```

### For `frontend` Structure

**amplify.yml:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - cd frontend
        - npm run build
  artifacts:
    baseDirectory: frontend/.next
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
      - frontend/.next/cache/**/*
```

## Turborepo Configuration

If you're using Turborepo, you might need to install dependencies at the root:

**amplify.yml for Turborepo:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci                    # Install root dependencies
        - npm run build --filter=web # Build only the web app
    build:
      commands:
        - echo "Build completed in preBuild"
  artifacts:
    baseDirectory: apps/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - apps/web/.next/cache/**/*
```

## Lerna Configuration

If you're using Lerna:

**amplify.yml for Lerna:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci                    # Install root dependencies
        - npx lerna bootstrap       # Bootstrap packages
    build:
      commands:
        - npx lerna run build --scope=web # Build only web package
  artifacts:
    baseDirectory: packages/web/.next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - packages/web/.next/cache/**/*
```

## Environment Variables

Make sure your environment variables are accessible from your app directory:

**For apps/web:**
```bash
# In AWS Amplify environment variables
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
```

**For packages/web:**
```bash
# Same variables, but make sure your app can access them
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
```

## Package.json Location

Ensure your app's `package.json` is in the correct location:

### For apps/web:
```
apps/web/package.json
```

### For packages/web:
```
packages/web/package.json
```

### For frontend:
```
frontend/package.json
```

## Prisma Configuration

If Prisma is in your app directory, update the Dockerfile:

**For apps/web:**
```dockerfile
WORKDIR /app/apps/web
RUN npx prisma generate
```

**For packages/web:**
```dockerfile
WORKDIR /app/packages/web
RUN npx prisma generate
```

## Testing Your Configuration

1. **Check your directory structure:**
   ```bash
   ls -la
   ```

2. **Verify your app location:**
   ```bash
   find . -name "package.json" -type f
   ```

3. **Test the build locally:**
   ```bash
   cd your-app-directory
   npm run build
   ```

## Common Issues

### Issue: "Cannot find package.json"
**Solution:** Make sure the `cd` command points to the correct directory in `amplify.yml`

### Issue: "Cannot find .next directory"
**Solution:** Update `baseDirectory` in `amplify.yml` to point to the correct `.next` location

### Issue: "Prisma client not found"
**Solution:** Make sure `npx prisma generate` runs in the correct directory

## Quick Setup

1. **Identify your app directory** (e.g., `apps/web`, `packages/web`, `frontend`)
2. **Update `amplify.yml`** with the correct paths
3. **Update `Dockerfile`** if using container deployment
4. **Test locally** before deploying
5. **Deploy to AWS Amplify**

## Example: Your Current Setup

Based on your project structure, you're likely using:
- **App directory**: `apps/web` or similar
- **Package manager**: npm
- **Framework**: Next.js
- **Database**: Railway PostgreSQL

Update the configuration files accordingly and you should be good to go! 