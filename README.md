# Nebib - Form & Attendance Management System

A modern, responsive form and attendance management application built with Next.js, featuring inline form building, QR code attendance tracking, and comprehensive help system.
 
## Features

- **Inline Form Builder**: Revolutionary "what you see is what you get" form creation
- **Advanced QR Attendance**: Admin-side QR scanning for student attendance tracking
- **Mobile-First Design**: Touch-friendly interface with responsive design
- **Built-in Help System**: Comprehensive guidelines and tutorials
- **Real-time Data**: Live form submissions and attendance tracking
- **Export Functionality**: Download form data and attendance reports

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Railway account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd nebib
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```bash
BETTER_AUTH_SECRET=your-development-secret-key
DATABASE_URL=your-database-url
NODE_ENV=development
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Railway Deployment

This application is optimized for Railway deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Setup:**
1. Connect your repository to Railway
2. Add a PostgreSQL database
3. Set environment variables (see DEPLOYMENT.md)
4. Deploy!

### Required Environment Variables

- `BETTER_AUTH_SECRET`: Strong secret key for authentication
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Set to "production" for deployment

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete Railway deployment instructions
- [CORS Setup](./CORS_SETUP.md) - CORS configuration details
- [QR Code Features](./QR_CODE_FEATURES.md) - QR code functionality documentation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Railway
- **QR Code**: @yudiel/react-qr-scanner

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
