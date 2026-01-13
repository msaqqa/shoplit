# 🛍️ Shoplit - Modern E-Commerce Platform

A full-featured e-commerce platform built with Next.js, featuring a powerful admin panel, secure authentication, shopping cart, and order management.

## ✨ Features

### Customer Features
- 🛒 **Shopping Cart** - Add, update, and remove products
- 🔍 **Product Search & Filtering** - Search products and filter by category
- 👤 **User Authentication** - Secure sign up, sign in, and password reset
- 📦 **Order Management** - View order history and track orders
- 💳 **Payment Integration** - Secure payments with Stripe
- 🎨 **Dark Mode** - Beautiful dark/light theme support
- 📱 **Responsive Design** - Works seamlessly on all devices

### Admin Features
- 📊 **Dashboard** - Analytics charts and statistics
- 🏷️ **Product Management** - Add, edit, and delete products
- 📂 **Category Management** - Organize products by categories
- 👥 **User Management** - Manage users and roles
- 📋 **Order Management** - View and manage all orders
- 📈 **Analytics** - Bar charts, pie charts, and area charts
- 🖼️ **Image Upload** - Cloudinary integration for product images

## 🛠️ Tech Stack

- **Framework:** Next.js 15.4.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Prisma ORM with SQLite
- **Authentication:** JWT (jose)
- **Payment:** Stripe
- **Image Upload:** Cloudinary
- **UI Components:** Radix UI, shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Email:** Resend

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

## 📁 Project Structure

```
shoplit/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── public/              # Static assets
│   └── products/        # Product images
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── (auth)/      # Authentication pages
│   │   ├── admin/       # Admin panel pages
│   │   ├── api/         # API routes
│   │   ├── cart/        # Shopping cart
│   │   ├── orders/      # Order pages
│   │   └── products/    # Product pages
│   ├── components/      # React components
│   │   ├── admin/       # Admin components
│   │   └── ui/          # UI components (shadcn/ui)
│   ├── lib/             # Utilities and helpers
│   │   ├── auth/        # Authentication utilities
│   │   └── prisma.ts    # Prisma client
│   ├── services/        # API services
│   ├── stores/          # Zustand stores
│   └── types/           # TypeScript types
└── package.json
```

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

Built with ❤️ using Next.js

---

**Note:** Remember to set up your environment variables and configure Stripe, Cloudinary, and Resend accounts before deploying to production.
