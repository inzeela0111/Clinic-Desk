# 🏥 ClinicDesk - Smart Clinic Management System

**ClinicDesk** is a modern, full-stack medical appointment management platform designed to bridge the gap between patients and healthcare providers. Built with a focus on high-end aesthetics and seamless user experience, it features an AI-powered symptom checker, automated slot management, and a robust admin dashboard.

---

## ✨ Key Features

### 👤 For Patients
- **AI Symptom Checker**: Integrated AI to help patients understand their symptoms and find relevant specialists.
- **Smart Booking**: Intuitive doctor search and real-time appointment booking.
- **Personal Dashboard**: Track upcoming appointments, view medical reports, and manage profile settings.
- **Public Doctor Profiles**: Comprehensive profiles with availability, expertise, and location details.
- **Secure Payments**: Integrated Razorpay gateway for seamless consultation fee payments.

### 👨‍⚕️ For Doctors
- **Schedule Management**: Automated and manual slot generation for the next 3 days.
- **Patient Tracking**: View and manage appointments in real-time.
- **Professional Profiles**: Customizable profiles to showcase expertise and clinic details.

### ⚙️ For Administrators
- **Comprehensive Dashboard**: Full control over doctors, users, and appointments.
- **Bulk Slot Generation**: Tools to quickly generate time slots for multiple doctors.
- **Appointment Control**: Manage booking statuses (Pending, Confirmed, Completed, Cancelled).
- **Analytics & Reports**: Visual data representation for clinic performance tracking.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4 (Glassmorphism & Dark Mode)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS
- **Payments**: Razorpay Node.js SDK
- **Automation**: Node-Cron for scheduled slot updates

### External Integrations
- **AI Engine**: OpenRouter (Gemini API) for symptom analysis.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 26-CD
   ```

2. **Backend Setup (Root Directory):**
   ```bash
   # Install dependencies
   npm install

   # Create a .env file in the root and add your variables (see below)
   
   # Start the server (Development)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   # Install dependencies
   npm install

   # Start the frontend
   npm run dev
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
PORT = 5005
MONGO_URI = your_mongodb_uri
JWT_SECRET = your_jwt_secret
OPENROUTER_API_KEY = your_openrouter_api_key
RAZORPAY_KEY_ID = your_razorpay_key_id
RAZORPAY_KEY_SECRET = your_razorpay_key_secret
VITE_RAZORPAY_KEY_ID = your_razorpay_key_id
```

---

## 📂 Project Structure

```text
26-CD/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices & logic
│   │   ├── pages/          # Full page components
│   │   └── services/       # API services (RTK Query)
├── server/                 # Express Backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & security
│   └── cron/               # Automated tasks (Slots)
├── package.json            # Root (Backend) dependencies
└── readme.md               # Project documentation
```

---

## 🎨 UI/UX Philosophy
ClinicDesk uses a **Glassmorphic Dark Theme** designed for premium medical interfaces.
- **Gradients**: Deep blues and teals for a professional look.
- **Interactions**: Smooth micro-animations using Framer Motion.
- **Responsiveness**: Fully optimized for mobile, tablet, and desktop views.

---

## 📄 License
This project is licensed under the ISC License.