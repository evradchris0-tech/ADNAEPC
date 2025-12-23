# ADNAEPC - Système de Gestion Paroissiale

[![Build Status](https://github.com/evradchris0-tech/ADNAEPC/workflows/CI/badge.svg)](https://github.com/evradchris0-tech/ADNAEPC/actions)

Parish Management System built with Next.js 15, TypeScript, Prisma, and Auth.js.

## ✨ Features

- 🌐 **Bilingual Interface** - French (default) and English with easy language switching
- 👥 **Member Management** - Track parishioners with unique matricule system (XXX-YY format)
- 🏛️ **Association Management** - Manage church groups and movements
- 📊 **Annual Commitments** - Financial commitments tracking with automatic debt carryover
- 💰 **Payment Recording** - Track all payments (tithe, construction offerings, debts)
- 📈 **Reports & Statistics** - Comprehensive reports and analytics
- 🔐 **Role-Based Access Control** - Admin, Manager, and User roles with granular permissions
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: MySQL 8.0 + [Prisma](https://www.prisma.io/) ORM
- **Authentication**: [Auth.js v5](https://authjs.dev/)
- **UI Components**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/evradchris0-tech/ADNAEPC.git
cd ADNAEPC
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/adnaepc_db"

# Auth.js (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

4. **Set up the database**

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Seed the database with initial data
npx prisma db seed
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Default Credentials

After seeding, use these credentials to login:

- **Email**: `admin@adnaepc.local`
- **Password**: `Admin@123`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest

## 🗂️ Project Structure

```
ADNAEPC/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── dashboard/          # Dashboard pages
│   │   └── login/              # Auth pages
│   ├── components/             # React components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   ├── tables/             # Table components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and services
│   │   ├── api/                # API client
│   │   ├── auth/               # Authentication helpers
│   │   ├── services/           # Business logic services
│   │   ├── utils/              # Utility functions
│   │   └── validations/        # Zod schemas
│   ├── messages/               # i18n translations
│   └── test/                   # Test setup
├── .env.example                # Environment variables template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── vitest.config.ts            # Vitest configuration
```

## 🌍 Internationalization

The application supports French (default) and English. To switch languages:

1. Click the language switcher in the header (🇫🇷 Français / 🇬🇧 English)
2. The language preference is stored in a cookie (`NEXT_LOCALE`)
3. All UI elements, validation messages, and notifications are translated

## 🔑 Permissions System

### Roles

- **ADMIN**: Full system access
- **MANAGER**: Can manage members, associations, commitments, and payments
- **USER**: Read-only access

### Permission Scopes

- `members.*` - Member management
- `associations.*` - Association management
- `commitments.*` - Commitment management
- `payments.*` - Payment management
- `reports.view` - View reports
- `users.*` - User management (admin only)

## 📊 Key Features

### Matricule System

Each member receives a unique matricule in the format `XXX-YY`:
- `XXX`: Sequential number (000-999)
- `YY`: Alpha suffix (aa-zz)
- Example: `001-aa`, `002-aa`, ..., `999-zz`, `000-ab`, etc.

### Annual Commitments

- Members make yearly financial commitments (tithe and construction offerings)
- Automatic migration to new year with debt carryover
- Real-time calculation of completion rates
- Balance tracking (committed vs. paid)

### Payment Tracking

- Multiple payment types: Tithe, Construction, Debt payments
- Payment methods: Cash, Check, Transfer, Mobile Money
- Detailed payment history with references
- Monthly and yearly reports

## 🧪 Testing

Run tests with:

```bash
npm run test
```

## 📦 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Ensure all environment variables are set in your production environment:

- `DATABASE_URL` - MySQL connection string
- `AUTH_SECRET` - Random secret for Auth.js
- `AUTH_URL` - Your production URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Chris Evrad**
- GitHub: [@evradchris0-tech](https://github.com/evradchris0-tech)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Generated with [Claude Code](https://claude.com/claude-code)
