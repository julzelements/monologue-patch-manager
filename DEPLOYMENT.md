# Vercel Deployment Setup

## Prerequisites

1. A Vercel account
2. GitHub repository connected to your Vercel project

## Setup Instructions

### 1. Get Your Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token (you won't see it again!)

### 2. Add Vercel Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VERCEL_TOKEN`
5. Value: Paste your token from step 1
6. Click **Add secret**

### 3. Link Your Vercel Project

1. Install Vercel CLI locally (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. Link your project:

   ```bash
   vercel link
   ```

   - Follow the prompts to connect to your Vercel account
   - Select your project (or create a new one)
   - This creates a `.vercel` folder with project configuration

3. Commit the `.vercel` folder:
   ```bash
   git add .vercel
   git commit -m "Add Vercel project configuration"
   git push
   ```

### 4. Configure Vercel Project Settings (Optional)

In your Vercel dashboard:

- **Framework Preset**: SvelteKit
- **Build Command**: `npm run build`
- **Output Directory**: `.svelte-kit`
- **Install Command**: `npm install`

### 5. Test the Workflow

Push a commit to the `main` branch and the GitHub Action will:

1. ✅ Install dependencies
2. ✅ Run ESLint
3. ✅ Run unit tests
4. ✅ Run component tests
5. ✅ Build the project
6. ✅ Deploy to Vercel

## Workflow Behavior

- **Push to `main`**: Builds, tests, and deploys to production
- **Pull Request**: Builds and tests only (creates preview deployment via Vercel's native GitHub integration)

## Manual Deployment

You can still deploy manually:

```bash
vercel --prod
```

## Troubleshooting

### Tests Failing

If you don't have tests written yet, you can temporarily skip them by commenting out the test steps in `.github/workflows/deploy.yml`

### Vercel CLI Errors

Make sure your `.vercel` folder is committed to the repository with the correct project ID and org ID.

### Build Errors

Check the GitHub Actions logs for detailed error messages. Common issues:

- Missing environment variables
- TypeScript errors
- Missing dependencies
