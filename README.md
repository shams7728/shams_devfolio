# Dynamic Multi-Role Portfolio Platform

A modern, full-stack portfolio platform built with Next.js 14+, Supabase, and premium animations. Showcase multiple professional roles with dynamic project management through a powerful admin dashboard.

## Features

- 🎨 **Multi-Role Portfolio**: Display multiple professional identities (Web Developer, Data Analyst, etc.)
- 🔐 **Secure Admin Dashboard**: Manage roles, projects, and media with authentication
- 🎬 **Premium Animations**: Smooth GSAP and Framer Motion animations
- 🚀 **Optimized Performance**: ISR, image optimization, and 60fps animations
- 📱 **Fully Responsive**: Mobile-first design from 320px to 4K
- 🌓 **Dark/Light Theme**: Persistent theme switching
- 🔍 **SEO Optimized**: Complete metadata and server-side rendering
- 📦 **Supabase Backend**: PostgreSQL database, authentication, and file storage

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: GSAP, Framer Motion, Lenis
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- npm or yarn

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd temp-portfolio

# Install dependencies
npm install
```

### 2. Set Up Supabase Backend

Follow the comprehensive guide in [`supabase/README.md`](./supabase/README.md) to:

1. Create a Supabase project
2. Run database migrations
3. Configure storage buckets
4. Create your first admin user

**Quick version:**

```bash
# 1. Create project at https://app.supabase.com
# 2. Copy credentials to .env.local
# 3. Run migrations in Supabase SQL Editor
# 4. Verify setup
npx tsx scripts/verify-supabase.ts
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Homepage
│   ├── roles/               # Role pages
│   └── admin/               # Admin dashboard (protected)
├── lib/                     # Utilities and helpers
│   └── types/               # TypeScript type definitions
├── supabase/                # Database migrations and docs
│   ├── migrations/          # SQL migration files
│   ├── README.md           # Supabase setup guide
│   ├── SCHEMA.md           # Database schema reference
│   └── DEPLOYMENT.md       # Deployment checklist
├── scripts/                 # Utility scripts
│   └── verify-supabase.ts  # Backend verification
└── .kiro/specs/            # Feature specifications
```

## Documentation

- **[Supabase Setup Guide](./supabase/README.md)**: Complete backend setup instructions
- **[Database Schema](./supabase/SCHEMA.md)**: Database structure and relationships
- **[Deployment Checklist](./supabase/DEPLOYMENT.md)**: Production deployment guide
- **[Feature Specs](./.kiro/specs/multi-role-portfolio/)**: Detailed requirements and design

## Database Schema

The platform uses three main tables:

- **users**: Admin user metadata (extends Supabase Auth)
- **roles**: Professional roles/identities
- **projects**: Portfolio projects associated with roles

Plus two storage buckets:
- **project-images**: Project cover images and galleries (5MB limit)
- **role-icons**: Role icons and images (2MB limit)

See [`supabase/SCHEMA.md`](./supabase/SCHEMA.md) for complete schema documentation.

## Development Workflow

### Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Verifying Supabase Setup

```bash
# Run verification script
npx tsx scripts/verify-supabase.ts
```

This checks:
- Environment variables are set
- Database connection works
- All tables exist
- Storage buckets are configured
- RLS policies are enforced

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See [`supabase/DEPLOYMENT.md`](./supabase/DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-secret
```

## Features Roadmap

- [x] Database schema and migrations
- [x] Storage bucket configuration
- [x] Row Level Security policies
- [ ] Authentication system
- [ ] Role management API
- [ ] Project management API
- [ ] Media upload system
- [ ] Public portfolio pages
- [ ] Admin dashboard
- [ ] Theme system
- [ ] Animations and transitions

## Contributing

This project follows a spec-driven development approach. See `.kiro/specs/multi-role-portfolio/` for:
- Requirements document
- Design document
- Implementation tasks

## License

MIT

## Support

For issues and questions:
- Check the documentation in `supabase/` directory
- Review the feature specs in `.kiro/specs/`
- Open an issue on GitHub

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)
