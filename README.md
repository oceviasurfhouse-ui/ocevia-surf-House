# OCEVIA Surf House - Complete Setup Guide

🌊 Premium Booking System for Surf House in Morocco

## 🚀 Features

- ✅ Secure booking system with validation
- ✅ Stripe payment integration
- ✅ Email confirmation via SendGrid
- ✅ AI chat assistant (OpenAI)
- ✅ JWT authentication
- ✅ Rate limiting & security headers
- ✅ Responsive design
- ✅ Dashboard analytics

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account
- Stripe account
- SendGrid account
- OpenAI API key

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/oceviasurfhouse-ui/ocevia-surf-House.git
cd ocevia-surf-House
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@ocevia.com

# OpenAI
OPENAI_API_KEY=sk-xxx

# Server
NODE_ENV=development
PORT=3000
JWT_SECRET=your_super_secret_key
```

### 4. Database Setup

1. Go to Supabase Dashboard
2. Create new project
3. Run SQL migrations from `supabase/migrations/001_initial_schema.sql`
4. Copy Project URL and API Key to `.env`

### 5. Run Application

**Development:**

```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
npm run server:dev
```

**Production:**

```bash
npm run build
npm run server
```

## 🔐 Security Features

✅ **Input Validation & Sanitization**
- Email validation using `validator.js`
- XSS protection with HTML escaping
- SQL injection prevention via parameterized queries

✅ **Authentication & Authorization**
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API endpoints

✅ **API Security**
- CORS restrictions
- Rate limiting (100 requests/15min)
- Helmet security headers
- No sensitive data in frontend code

✅ **Data Protection**
- Supabase Row Level Security (RLS)
- Service role key isolation
- Encrypted payment handling via Stripe

## 📡 API Endpoints

### Bookings

```
POST   /api/bookings              - Create booking
GET    /api/bookings              - List all bookings (auth required)
GET    /api/bookings/:id          - Get booking details
PUT    /api/bookings/:id          - Update booking (auth required)
```

### Payments

```
POST   /api/payments/checkout     - Create Stripe session
POST   /api/payments/webhook      - Stripe webhook handler
```

### Chat

```
POST   /api/chat/message          - Send message to AI
```

### Email

```
POST   /api/email/send-booking-confirmation - Send booking email
```

### Auth

```
POST   /api/auth/register         - Register user
POST   /api/auth/login            - Login user
```

## 🧪 Testing

Test the API with curl:

```bash
# Create Booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","room":"Surf Loft","days":3}'

# Send Chat Message
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"What is your best room?"}'
```

## 📊 Database Schema

### bookings
- id (UUID)
- name (VARCHAR)
- email (VARCHAR)
- room (VARCHAR)
- days (INTEGER)
- price (DECIMAL)
- status (pending/confirmed/cancelled)
- payment_id (VARCHAR)
- created_at (TIMESTAMP)

### payments
- id (UUID)
- booking_id (UUID FK)
- amount (DECIMAL)
- status (pending/completed/failed)
- stripe_payment_intent_id (VARCHAR)

### users
- id (UUID)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- created_at (TIMESTAMP)

## 🚨 Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Stripe not defined"
- Ensure VITE_STRIPE_PUBLIC_KEY is in .env
- Check browser console for script load errors

### "Email not sending"
- Verify SENDGRID_API_KEY
- Check SendGrid sender authentication
- Verify EMAIL_FROM domain

### "Chat not working"
- Check OPENAI_API_KEY
- Verify API key has chat completions enabled
- Check OpenAI rate limits

## 📝 Deployment

### Vercel (Frontend)

```bash
vercel --env-file .env
```

### Heroku (Backend)

```bash
heroku create ocevia-backend
heroku config:set $(cat .env | tr '\n' ' ')
git push heroku main
```

### Environment Variables on Deployment

Set all variables from `.env` in your deployment platform's settings.

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Integration](https://stripe.com/docs)
- [SendGrid API](https://docs.sendgrid.com)
- [OpenAI API](https://platform.openai.com/docs)

## 📞 Support

For issues or questions:
1. Check the `.env.example` for correct variable names
2. Verify all API keys are active
3. Check browser/server console for errors
4. Review API response status codes

## 📄 License

MIT License - See LICENSE file

---

🌊 **Made with ❤️ for Surfers** 🏄
