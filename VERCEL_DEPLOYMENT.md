**`VERCEL_DEPLOYMENT.md`**
```markdown
# Vercel Deployment Guide

This project is optimized for deployment on Vercel utilizing Next.js Serverless Functions.

## Step-by-Step Vercel Deployment

1. **Push your code to GitHub:** Ensure your project is in a GitHub, GitLab, or Bitbucket repository.
2. **Import Project:** Go to your Vercel Dashboard -> Add New -> Project. Select your repository.
3. **Configure Build Settings:**
   - Framework Preset: **Next.js**
   - Build Command: `npx prisma generate && next build`
   - Install Command: `npm install`
   - Output Directory: `.next`

## Environment Variable Setup
Before clicking Deploy, navigate to the **Environment Variables** section in the Vercel setup UI and add:
- `AI_PROVIDER`
- `OPENROUTER_API_KEY` (Or your chosen provider's key)
- `DATABASE_URL`

## Database Setup for Production
Vercel serverless functions require a connection-pooled database.
1. Use **Supabase**, **Neon**, or **Vercel Postgres** to spin up a production Postgres database.
2. Get the connection string (ensure it uses `pgbouncer` or a pooler connection string if necessary).
3. Set this string as your `DATABASE_URL` in Vercel.
4. Run migrations against your production DB from your local machine: `npx prisma db push`.

## Domain / Preview Deployment Notes
- Every pull request will automatically generate a Preview Deployment in Vercel.
- Once deployed to production, you can configure a custom domain under the project's **Settings > Domains** tab in Vercel.

## Troubleshooting Common Issues
- **`PrismaClientInitializationError`:** Usually means `npx prisma generate` was not run during the build step. Ensure your build command includes it.
- **File Upload Limits:** Vercel serverless functions have a 4.5MB payload limit on the Hobby tier. Ensure resumes/JDs uploaded are under this size, or switch to presigned S3 URLs/Blob storage for larger files.
- **Timeout Errors:** AI API calls can sometimes exceed Vercel's Hobby tier 10-second timeout. If this happens, upgrade to Pro (up to 300s) or utilize Vercel AI SDK's streaming capabilities to keep the connection alive.