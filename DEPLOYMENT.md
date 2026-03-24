# Hopewell ChMS Deployment Guide

## Prerequisites Checklist

- [ ] Supabase project created (https://supabase.com)
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] GitHub repository (for Vercel deployment)
- [ ] Vercel account (recommended for production)
- [ ] Custom domain (optional)

## Local Development Setup

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/hopewell-chms.git
cd hopewell-chms
npm install --legacy-peer-deps
```

### 2. Environment Setup
```bash
cp .env.example .env.local
```

Edit `.env.local` with all your credentials.

### 3. Database Setup
```bash
npm install -g supabase
supabase start
supabase login
supabase link --project-ref your-project-id
supabase db push
supabase seed apply
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Migrations

### Apply Migrations
```bash
supabase migrations up
```

### Create New Migration
```bash
supabase migrations new migration_name
```

Edit the file in `supabase/migrations/` then apply it:
```bash
supabase migrations up
```

## Edge Functions Deployment

Deploy all Edge Functions:
```bash
supabase functions deploy send-otp
supabase functions deploy mpesa-stk-push
supabase functions deploy mpesa-callback
supabase functions deploy ai-sermon-assistant
supabase functions deploy ai-member-insights
supabase functions deploy ai-smart-search
supabase functions deploy ai-follow-up
supabase functions deploy ai-prayer-categorisation
supabase functions deploy bulk-sms
supabase functions deploy bulk-email
```

Test locally:
```bash
supabase functions serve
```

## Vercel Deployment (Recommended)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Connect to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Choose "Next.js" preset
4. Add environment variables

### 3. Environment Variables in Vercel
Add all variables from `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- `MPESA_SHORTCODE`
- etc.

### 4. Deploy
Click "Deploy" button on Vercel dashboard.

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Build and Run
```bash
docker build -t hopewell-chms .
docker run -p 3000:3000 --env-file .env.local hopewell-chms
```

## Manual Server Deployment

### Using PM2

```bash
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "hopewell-chms" -- start

# Monitor
pm2 monit
```

### Using Systemd (Linux)

Create `/etc/systemd/system/hopewell-chms.service`:
```ini
[Unit]
Description=Hopewell ChMS
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/hopewell-chms
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/hopewell-chms/.env.prod
ExecStart=/usr/bin/node /var/www/hopewell-chms/.next/standalone/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
systemctl enable hopewell-chms
systemctl start hopewell-chms
```

## SSL/TLS Certificate

For production, use Let's Encrypt with Certbot:

```bash
sudo certbot certonly --standalone -d yourdomain.com
```

Configure in reverse proxy (Nginx/Apache).

## Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Enable Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

## Monitoring & Logging

### Using Sentry (Optional)
Set `NEXT_PUBLIC_SENTRY_DSN` environment variable.

### Application Logs
```bash
# View application logs
pm2 logs hopewell-chms

# Or with systemd
journalctl -u hopewell-chms -f
```

## Database Backups

### Automatic Backups (Supabase)
Supabase automatically backs up daily. Configure in Supabase dashboard.

### Manual Backup
```bash
supabase db push --force
supabase db pull > backup.sql
```

### Restore
```bash
psql -h your-host -U postgres < backup.sql
```

## Scaling

### Database Scaling
- Monitor connection count in Supabase dashboard
- Consider read replicas for high traffic
- Optimize queries with proper indexes

### Application Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Use Vercel auto-scaling (if using Vercel)

## Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
```bash
# Check Supabase status
supabase status

# Test connection
psql postgresql://postgres:password@host/database
```

### Edge Function Issues
```bash
# Test locally
supabase functions serve

# Check logs
supabase functions logs send-otp
```

## Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS/TLS enabled
- [ ] Row-Level Security (RLS) enabled on all tables
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Sensitive data encrypted at rest
- [ ] Regular security audits scheduled
- [ ] Admin accounts with 2FA enabled
- [ ] Regular backups tested
- [ ] Error logging (Sentry) configured

## Post-Deployment

1. Test all features:
   - Authentication flow
   - Member registration
   - Giving system
   - Event registration
   - Sermon upload
   - SMS/Email sending

2. Monitor for 24 hours
   - Check error logs
   - Monitor performance metrics
   - Verify all integrations working

3. Setup alerting:
   - Database down
   - High error rate
   - Performance degradation
   - Failed transactions

## Maintenance Schedule

- **Daily**: Check error logs, verify backups
- **Weekly**: Performance analysis, security updates
- **Monthly**: Database optimization, dependency updates
- **Quarterly**: Security audit, disaster recovery test

## Support & Escalation

- Production Issues: contact@hopewellchms.com
- Technical Support: support@hopewellchms.com
- Security Issues: security@hopewellchms.com
