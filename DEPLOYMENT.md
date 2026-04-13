# Deployment Guide

## Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Create Render configuration file** (already created: `render.yaml`)

2. **Verify backend main.py is production-ready**
   - Ensure the main.py uses environment variables
   - The server should listen on `0.0.0.0` and use `$PORT` environment variable

### Step 2: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Create Render account**
   - Go to https://render.com
   - Sign up/login with GitHub

2. **Create PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Name: `brandguard-db`
   - Database Name: `brand_monitoring`
   - User: `brandguard_user`
   - Region: Choose nearest region
   - Click "Create Database"
   - Wait for database to be ready (2-3 minutes)
   - Copy the **Internal Database URL** for later

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `Sooryapraveen999/DigiFortex_assignment`
   - Name: `brandguard-backend`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Click "Advanced" → "Add Environment Variable"
     - `DATABASE_URL`: Paste the Internal Database URL from Step 2
     - `NEWS_API_KEY`: Your NewsAPI key
     - `SERPAPI_API_KEY`: Your SerpAPI key
   - Click "Deploy Web Service"
   - Wait for deployment (3-5 minutes)

4. **Get Backend URL**
   - After deployment, Render will provide a URL like: `https://brandguard-backend.onrender.com`
   - Copy this URL for frontend configuration

#### Option B: Using Render YAML (Already Configured)

1. **Push render.yaml to GitHub**
   ```bash
   git add render.yaml
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to Render dashboard
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select `render.yaml` file
   - Click "Apply Blueprint"
   - Render will create database and web service automatically

### Step 3: Verify Backend Deployment

1. **Test health endpoint**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Expected response: `{"status":"ok"}`

2. **Test scan endpoint**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/scan \
     -H "Content-Type: application/json" \
     -d '{"company_name":"Test","brand_keywords":["test"],"domain_name":"test.com","products_or_services":["test"],"social_handles":["@test"]}'
   ```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Create environment file for production**
   - Create `frontend/.env.production`:
     ```env
     NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL

2. **Update .gitignore to exclude .env files** (already done)

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Create Vercel account**
   - Go to https://vercel.com
   - Sign up/login with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `Sooryapraveen999/DigiFortex_assignment`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Click "Environment Variables"
     - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://brandguard-backend.onrender.com`)
   - Click "Deploy"
   - Wait for deployment (1-2 minutes)

4. **Get Frontend URL**
   - Vercel will provide a URL like: `https://your-project.vercel.app`
   - Copy this URL for access

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy frontend**
   ```bash
   cd frontend
   vercel
   ```
   - Follow the prompts:
     - Link to existing project? No
     - Project name: brandguard-frontend
     - Directory: `.` (current directory)
     - Override settings? No
   - Vercel will deploy and provide a preview URL

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Step 3: Verify Frontend Deployment

1. **Visit your Vercel URL**
   - Open: `https://your-project.vercel.app`
   - Should see the BrandGuard landing page

2. **Test login**
   - Navigate to `/login`
   - Login with: `admin@brandguard.com` / `admin123`
   - Should redirect to dashboard

3. **Test scan functionality**
   - Navigate to `/scan`
   - Enter company details and run a scan
   - Should successfully connect to backend and display results

---

## Post-Deployment Configuration

### Update GitHub Repository

1. **Add deployment files**
   ```bash
   git add render.yaml DEPLOYMENT.md
   git commit -m "Add deployment configuration and guide"
   git push origin main
   ```

### Environment Variables Summary

**Backend (Render):**
- `DATABASE_URL`: PostgreSQL connection string (from Render database)
- `NEWS_API_KEY`: Your NewsAPI key
- `SERPAPI_API_KEY`: Your SerpAPI key

**Frontend (Vercel):**
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://brandguard-backend.onrender.com`)

---

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Ensure DATABASE_URL is correct in Render environment variables
- Check Render database is in "Available" state
- Verify database URL format: `postgresql://user:password@host:port/database`

**Build Error:**
- Check `requirements.txt` is in backend directory
- Verify all dependencies are listed correctly
- Check Render build logs for specific error

**API Not Responding:**
- Check Render service status in dashboard
- Verify start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Check Render logs for runtime errors

### Frontend Issues

**Build Error:**
- Ensure `package.json` is in frontend directory
- Check all dependencies are installed
- Verify TypeScript configuration is correct

**API Connection Error:**
- Ensure NEXT_PUBLIC_API_URL is set in Vercel environment variables
- Verify backend URL is correct and accessible
- Check CORS settings if needed

**Authentication Not Working:**
- Ensure localStorage is accessible in production
- Check browser console for errors
- Verify authentication flow is working

---

## Cost Considerations

**Render (Free Tier):**
- PostgreSQL: Free tier (90 days, then $7/month)
- Web Service: Free tier (750 hours/month, then $7/month)

**Vercel (Free Tier):**
- Hobby plan: Free (100GB bandwidth/month)
- No cost for personal projects

---

## Domain Configuration (Optional)

### Custom Domain for Backend (Render)
1. Go to Render service dashboard
2. Click "Settings" → "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Custom Domain for Frontend (Vercel)
1. Go to Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## Monitoring

### Render Monitoring
- View logs in Render dashboard
- Check metrics (CPU, memory, response time)
- Set up alerts for errors

### Vercel Monitoring
- View logs in Vercel dashboard
- Check analytics (page views, visitors)
- Set up deployments notifications

---

## Security Notes

1. **Never commit API keys** to GitHub
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** (both Render and Vercel provide this by default)
4. **Regularly update dependencies** for security patches
5. **Monitor logs** for suspicious activity
