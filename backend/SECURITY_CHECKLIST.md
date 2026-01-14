# Security Checklist for Production Deployment

This checklist must be completed before deploying AgileSourcing to production.

## Environment Configuration

- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] `APP_KEY` is a unique, securely generated key
- [ ] `APP_URL` is set to the production domain (HTTPS)

## Database Security

- [ ] `DB_PASSWORD` is a strong, unique password (not `123456`)
- [ ] Database user has minimal required permissions
- [ ] Database connections use SSL/TLS in production
- [ ] Regular database backups are configured and encrypted

## Session & Cookie Security

- [ ] `SESSION_ENCRYPT=true`
- [ ] `SESSION_SECURE_COOKIE=true`
- [ ] `SESSION_SAME_SITE=strict` or `lax`
- [ ] `SESSION_LIFETIME` is appropriate (120 minutes default)

## Redis Security

- [ ] `REDIS_PASSWORD` is set (not null)
- [ ] Redis is not exposed to public network
- [ ] Redis TLS enabled if communicating over network

## API & Authentication

- [ ] `SANCTUM_STATEFUL_DOMAINS` only includes production domains
- [ ] Rate limiting is configured and tested
- [ ] CORS `allowed_origins` only includes production frontend URL
- [ ] All API endpoints require authentication where appropriate

## Third-Party Services

### Stripe
- [ ] Using production Stripe API keys
- [ ] `STRIPE_WEBHOOK_SECRET` is set for production
- [ ] Webhook endpoint is properly secured

### Instagram
- [ ] Using production Instagram app credentials
- [ ] `INSTAGRAM_REDIRECT_URI` points to production URL
- [ ] Access tokens are encrypted at rest

### OpenAI / Gemini
- [ ] API keys are production keys
- [ ] Usage limits/budgets are configured

## Logging & Monitoring

- [ ] `LOG_LEVEL=warning` or `error` (not `debug`)
- [ ] Security logs are being written to `storage/logs/security.log`
- [ ] Log aggregation service is configured (optional but recommended)
- [ ] Error monitoring service is configured (Sentry, Bugsnag, etc.)

## File Storage

- [ ] Sensitive uploads stored on `private` disk
- [ ] File access requires authentication
- [ ] File upload limits are enforced
- [ ] File type validation is enabled

## Frontend Security

- [ ] `NEXT_PUBLIC_API_URL` uses HTTPS
- [ ] CSP header is configured and tested
- [ ] HSTS header is enabled
- [ ] No sensitive data in browser console

## Infrastructure

- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] SSL/TLS certificate is valid and auto-renewed
- [ ] Firewall rules configured (only necessary ports open)
- [ ] SSH key authentication (password auth disabled)

## Passwords & Secrets

- [ ] All default passwords have been changed
- [ ] Secrets are stored in environment variables, not code
- [ ] `.env` file is not committed to version control
- [ ] Password complexity requirements are enforced

## Additional Checks

- [ ] Run `php artisan config:clear` before deployment
- [ ] Run `npm run build` with no errors
- [ ] Verify rate limiting works correctly
- [ ] Test account lockout mechanism
- [ ] Verify email verification flow works
- [ ] Test password reset flow

## Post-Deployment

- [ ] Monitor security logs for anomalies
- [ ] Set up alerts for failed login spikes
- [ ] Schedule regular security reviews
- [ ] Keep dependencies updated

---

## Quick Commands

```bash
# Generate a secure APP_KEY
php artisan key:generate

# Clear all caches before production
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run Laravel Pint for code style
./vendor/bin/pint

# Run tests
php artisan test
```

---

Last updated: January 2026
