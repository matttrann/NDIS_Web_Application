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
# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth
AUTH_SECRET=""  # Generate at https://generate-secret.vercel.app/32
GOOGLE_CLIENT_ID=""  # From Google Cloud Console
GOOGLE_CLIENT_SECRET=""  # From Google Cloud Console
GITHUB_OAUTH_TOKEN=your_github_token  # From GitHub Developer Settings
  

# Database
# DATABASE_URL=""  # From Neon Dashboard
DATABASE_URL=""
  

# Email
RESEND_API_KEY=""  # From Resend Dashboard
EMAIL_FROM="onboarding@resend.dev"  # Your sender email

# Stripe
STRIPE_API_KEY=""  # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=""  # From Stripe Dashboard
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID=""  # From Stripe Products/Prices
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID=""  # From Stripe Products/Prices  

# Gemini
GEMINI_API_KEY=""

# Add these new variables for video generation
GOOGLE_API_KEY="" # Get from Google Cloud Console - Enable Cloud Text-to-Speech API
GOOGLE_TTS_API_KEY=""
ASSEMBLYAI_API_KEY="" # Get from AssemblyAI Dashboard for Captions 
REPLICATE_API_TOKEN="" # Get from Replicate Dashboard for AI API Image and Lip Sync Generation

# # AI Services
# GOOGLE_TTS_API_KEY=""
# ASSEMBLYAI_API_KEY=""

# AWS
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME="skills4life-videos"

# CDN AWS CloudFront
CLOUDFRONT_DOMAIN=""
CLOUDFRONT_KEY_PAIR_ID=""
CLOUDFRONT_PRIVATE_KEY=""

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
