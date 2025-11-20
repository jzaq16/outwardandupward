# Deployment Guide: Vercel

This project is optimized for deployment on **Vercel**. Follow these steps to get your application live.

## 1. Prerequisites
- A [Vercel Account](https://vercel.com/signup).
- The project pushed to a Git provider (GitHub, GitLab, or Bitbucket).

## 2. Verify Build (Optional)
We have already verified that the project builds correctly. If you want to double-check locally:
```bash
npm run build
npm run preview
```

## 3. Deploy to Vercel
1.  **Log in** to your Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import** your `outwardandupward` repository.
4.  **Configure Project**:
    - **Framework Preset**: Vercel should automatically detect **Vite**.
    - **Root Directory**: `./` (default)
    - **Build Command**: `vite build` (default)
    - **Output Directory**: `dist` (default)
5.  Click **Deploy**.

## 4. Post-Deployment
- Vercel will provide a live URL (e.g., `outwardandupward.vercel.app`).
- Any changes pushed to your `main` branch will automatically trigger a new deployment.
