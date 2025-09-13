# EF Clash - Deployment Guide

## 🚀 Quick Start

### Development Environment

**Windows:**
```bash
# Run the startup script
start-dev.bat
```

**Linux/macOS:**
```bash
# Make script executable and run
chmod +x start-dev.sh
./start-dev.sh
```

**Manual Setup:**
```bash
# Frontend
npm install
npm run dev

# Backend (in separate terminal)
cd backend
pip install -r requirements.txt
python main.py
```

## 🌐 Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Environment Setup:**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

2. **Configure Environment Variables:**
```env
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# backend/.env
GEMINI_API_KEY=your_gemini_key
```

3. **Deploy:**
```bash
docker-compose up -d
```

### Option 2: Oracle Cloud VPS

1. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.11
sudo apt install python3.11 python3.11-pip -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

2. **Deploy Application:**
```bash
# Clone repository
git clone <your-repo-url> /var/www/ef-clash
cd /var/www/ef-clash

# Frontend build
npm install
npm run build

# Backend setup
cd backend
pip3 install -r requirements.txt

# Start backend with PM2
pm2 start main.py --name ef-clash-backend --interpreter python3

# Configure Nginx
sudo cp nginx-frontend.conf /etc/nginx/sites-available/ef-clash
sudo ln -s /etc/nginx/sites-available/ef-clash /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Option 3: Netlify + Railway

**Frontend (Netlify):**
1. Connect GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`

**Backend (Railway):**
1. Connect GitHub repository to Railway
2. Deploy from `backend` folder
3. Environment variables:
   - `GEMINI_API_KEY`

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project
- Note your project URL and anon key

### 2. Run Database Schema
Execute the SQL from `README.md` in Supabase SQL Editor:

```sql
-- Copy and paste the complete schema from README.md
-- This includes all tables, RLS policies, and triggers
```

### 3. Configure Authentication
- Enable Email authentication
- Enable Google OAuth (optional)
- Configure redirect URLs for your domain

### 4. Storage Setup
```sql
-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Create storage policy
CREATE POLICY "Screenshots are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');
CREATE POLICY "Authenticated users can upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots' AND auth.role() = 'authenticated');
```

## 🔑 API Keys Setup

### Gemini AI API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to backend environment variables

### Supabase Keys
1. Go to your Supabase project settings
2. Copy Project URL and anon/public key
3. Add to frontend environment variables

## 🔒 Security Configuration

### Environment Variables (Production)
```env
# Frontend (.env)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-api-domain.com

# Backend (.env)
GEMINI_API_KEY=your-gemini-key
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📱 PWA Configuration

### Icons Generation
Use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator):

```bash
npx pwa-asset-generator logo.svg public/icons --manifest public/manifest.json
```

### Service Worker
The Vite PWA plugin automatically generates the service worker. For custom caching:

```javascript
// vite.config.js - workbox configuration
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24
        }
      }
    }
  ]
}
```

## 🔍 Monitoring & Analytics

### Health Checks
```bash
# Backend health
curl https://your-api-domain.com/health

# Frontend availability
curl https://your-domain.com
```

### PM2 Monitoring
```bash
# View processes
pm2 list

# View logs
pm2 logs ef-clash-backend

# Restart application
pm2 restart ef-clash-backend
```

### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

### Common Issues

**CORS Errors:**
- Check backend CORS configuration in `main.py`
- Ensure frontend URL is in allowed origins

**PWA Not Installing:**
- Verify manifest.json is accessible
- Check service worker registration
- Ensure HTTPS is enabled

**AI Verification Failing:**
- Verify Gemini API key is correct
- Check API quotas and limits
- Review image format and size

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure tables exist

### Performance Optimization

**Frontend:**
- Enable gzip compression in Nginx
- Optimize images and assets
- Use CDN for static assets

**Backend:**
- Implement Redis caching
- Database query optimization
- Rate limiting

## 📊 Scaling Considerations

### Load Balancing
```nginx
upstream backend {
    server backend1:8000;
    server backend2:8000;
    server backend3:8000;
}
```

### Database Scaling
- Read replicas for Supabase
- Connection pooling
- Query optimization

### CDN Integration
- CloudFlare for global distribution
- Asset optimization
- Image compression

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy EF Clash
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Your deployment script
```

This deployment guide covers all aspects of getting EF Clash running in production with proper security, monitoring, and scaling considerations.
