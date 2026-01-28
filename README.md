# 🛍️ Shoplit - Modern E-Commerce Platform

A full-featured full-stack e-commerce solution built with Next.js 15, optimized for speed and accessibility, featuring a powerful admin panel, secure authentication, shopping cart, and order management.

## ✨ Features

### Customer Features

### 🔍 Smart Search - Debounced, case-insensitive product search with real-time URL synchronization.

- 🛒 **Shopping Cart** - Persisted cart state with Zustand for a seamless shopping experience.
- 👤 **User Profiles** - Comprehensive account management with profile completion tracking and activity charts.
- 🌓 **Theme Support** - Seamless switching between Dark and Light modes using high-contrast themes.

### Admin Features

- 📈 **Advanced Analytics** - Interactive charts powered by Recharts for tracking user activity and real-time sales data.
- ⚒️ **Full CRUD Operations** - Efficient management of products, categories, and users through a dedicated professional dashboard.
- 📁 **Cloudinary Integration** - Automated image optimization and cloud storage ensuring fast delivery for all product assets.

## 🛠️ Tech Stack

- Framework: Next.js 15.4.5 (App Router)
- Styling: Tailwind CSS 4
- Database: Prisma ORM with PostgreSQL
- Auth: JWT (jose) & Role-based Access Control
- State: Zustand
- UI: shadcn/ui (Radix UI)

## 🔐 Authentication

The application uses JWT-based authentication with secure password hashing using bcryptjs.

- **Sign Up:** Create a new account
- **Sign In:** Login with email and password
- **Password Reset:** Reset forgotten passwords via email
- **Role-based Access:** ADMIN and CLIENT roles

## 💳 Payment Integration

Stripe is integrated for secure payment processing:

- Stripe Checkout for payment
- Webhook handling for order confirmation
- Order status tracking (success/failed)

## 📦 Database Models

- **User** - User accounts with roles and authentication
- **Product** - Products with categories, sizes, colors, and images
- **Category** - Product categories
- **Order** - Customer orders
- **OrderProduct** - Order items
- **PasswordResetToken** - Password reset tokens

## 🎨 UI Components

The project uses [shadcn/ui](https://ui.shadcn.com/) components built on Radix UI:

- Responsive design
- Dark mode support
- Accessible components
- Customizable styling

## 📁 Project Structure

```
shoplit/
├── prisma/          # Database schema & migrations
├── public/          # Static assets (Favicon, local images)
├── src/
│ ├── animations/    # Global Framer Motion or CSS animations
│ ├── app/           # Next.js App Router (Core Routes)
│ │ ├── (client)/    # Customer-facing routes (Home, Products, Account)
│ │ ├── admin/       # Protected Admin dashboard routes
│ │ ├── api/         # Backend API endpoints
│ │ ├── actions/     # Next.js Server Actions (Database logic)
│ │ ├── globals.css  # Tailwind global styles
│ │ └── layout.tsx   # Root layout with Providers
│ ├── components/    # React Components
│ │ ├── admin/       # Admin-specific UI (Charts, Tables)
│ │ ├── client/      # Client-specific UI (Forms, Product Cards)
│ │ ├── common/      # Shared components (Navbar, Footer)
│ │ ├── skeletons/   # Loading states (Skeleton Loaders)
│ │ └── ui/          # Base UI components (shadcn/ui)
│ ├── hooks/         # Custom React hooks (useDebounce, etc.)
│ ├── lib/           # Shared utilities (Schemas, Prisma client)
│ ├── providers/     # Context Providers (Theme, Toast, Sidebar)
│ ├── services/      # External API services (Cloudinary, Auth)
│ ├── stores/        # Zustand state management
│ └── types/         # TypeScript definitions & interfaces
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/shoplit.git
   cd shoplit
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # JWT Secret
   JWT_SECRET=your-jwt-secret-key

   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Resend (Email)
   RESEND_API_KEY=your-resend-api-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database (optional)
   npm run prisma:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run prisma:seed # Seed the database
```

## 🔒 Environment Variables

Make sure to set up all required environment variables before running the application. See the installation section for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built by Mahmoud Alsaqqa using with Next.js.
