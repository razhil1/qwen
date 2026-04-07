# Property Management System (PMS)

A comprehensive, production-ready multi-property management system supporting Apartments, Boarding Houses, Hotels, Hostels, Condominiums, and Vacation Rentals.

## 🏗️ System Architecture

```
pms/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & app configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Sequelize ORM models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── validators/     # Input validation schemas
│   ├── migrations/         # Database migrations
│   ├── seeders/           # Sample data
│   └── package.json
│
└── frontend/              # React + TypeScript UI
    ├── public/
    └── src/
        ├── components/    # Reusable UI components
        ├── context/       # React context providers
        ├── hooks/         # Custom React hooks
        ├── pages/         # Page components
        ├── services/      # API client
        ├── styles/        # Global styles
        └── utils/         # Utility functions
```

## 🚀 Features

### 1. Property Management
- Multi-property support (hotel, hostel, apartment, boarding house, condo, resort)
- Building > Floor > Room hierarchy
- Room categories and dynamic pricing
- Real-time status tracking

### 2. Guest & Tenant Management
- Unified profiles with ID verification
- Guest history and preferences
- Blacklist/VIP system

### 3. Reservations & Bookings
- Interactive calendar (day/week/month/timeline views)
- Overbooking detection
- Group bookings and long-term contracts

### 4. Check-in / Check-out
- Digital forms with e-signature
- Room and key assignment
- Damage recording

### 5. Billing & Payments
- Auto-generated invoices
- Multiple payment methods
- Security deposits and refunds
- PDF receipts

### 6. Housekeeping
- Cleaning schedules and task assignment
- Status tracking (dirty/clean/inspected)
- Inventory management

### 7. Maintenance
- Work order management
- Priority levels and assignments
- Preventive maintenance scheduling

### 8. Dashboard & Reports
- Real-time occupancy grid
- Revenue analytics (ADR, RevPAR)
- Export to PDF/Excel

### 9. Staff Management
- Role-based access control
- Audit logging
- Shift tracking

### 10. Tenant Portal
- Self-service dashboard
- Online rent payment
- Maintenance requests

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT
- **Validation:** Joi
- **File Upload:** Multer
- **PDF Generation:** PDFKit
- **Email:** Nodemailer

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **State Management:** React Context + useReducer
- **Routing:** React Router v6
- **UI Library:** Tailwind CSS
- **Calendar:** FullCalendar
- **Charts:** Chart.js / Recharts
- **HTTP Client:** Axios

## 📋 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 🔐 Default Credentials

After seeding:
- **Super Admin:** admin@pms.com / admin123
- **Property Manager:** manager@pms.com / manager123
- **Front Desk:** frontdesk@pms.com / frontdesk123

## 📊 Database Schema

See `docs/ERD.md` for complete entity relationship diagram.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 License

MIT License

## 👥 Support

For issues and feature requests, please open an issue on GitHub.
