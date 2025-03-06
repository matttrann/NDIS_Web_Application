# Skills4Life Platform

A Next.js-based platform with authentication, payments, and content management for our Capstone.

## Prerequisites

- Node.js v16.18.0 (via [nvm](https://github.com/nvm-sh/nvm) recommended)
- PostgreSQL database
- Stripe account
- AWS account (for S3 storage)
- Google OAuth credentials
- GitHub OAuth token (Not needed so can leave blank)
- Resend API key (for emails)

## Installation

1. **Clone repository**
```bash
git clone https://github.com/unflirting/T234_Capstone_Project.git
cd skills4life
```

2. **Install dependencies**
```bash
nvm use  # Uses Node.js v16.18.0 specified in .nvmrc
pnpm install
```

3. **Environment Setup**
Create `.env` and `.env.local` file with these variables, furthermore refer to `.env.example` for specifics:
```bash
# Authentication
AUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_OAUTH_TOKEN=your_github_token

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skills4life?schema=public"

# Payments
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=price_...

# Storage
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=no-reply@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Database Setup**
```bash
npx prisma generate
npx prisma db push
```

## Running the Application

**Development mode:**
```bash
pnpm run dev
```

**Production build:**
```bash
pnpm run build
pnpm start
```

## Key Features Configuration

### Stripe Integration
1. Create products/prices in Stripe Dashboard
2. Set plan IDs in environment variables
3. Configure webhook endpoint to `/api/webhooks/stripe`

### AWS S3 Configuration
1. Create S3 bucket with proper permissions
2. Configure CORS policy for bucket
3. Set AWS credentials in environment

### Email Setup
1. Create Resend account and verify domain
2. Configure email templates in `/emails` directory
3. Test emails using `pnpm run email`

## Project Structure
├── prisma/ # Database schema<br>
├── src/ # Application code<br>
│ ├── pages/ # Next.js pages<br>
│ ├── components/ # UI components<br>
│ ├── lib/ # Shared utilities<br>
│ └── server/ # Server-side logic<br>
├── public/ # Static assets<br>
└── emails/ # Email templates<br>

## Troubleshooting

**Database Issues:**
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` format
- Run `npx prisma migrate reset` if schema changes

**Authentication Problems:**
- Check OAuth credentials
- Verify callback URLs in provider dashboards
- Ensure `NEXTAUTH_URL` matches deployment URL

**Payment Failures:**
- Test with Stripe test cards
- Verify webhook endpoint configuration
- Check Stripe dashboard for error logs

## Deployment

1. Set up production environment variables
2. Configure reverse proxy (Nginx/Apache)
3. Set up process manager (PM2/systemd)
4. Enable automatic Prisma migrations:
```bash
npx prisma migrate deploy
```

## License

MIT License - See [LICENSE](https://www.youtube.com/watch?v=dQw4w9WgXcQ) for details.
