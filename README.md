# AdsReader Frontend

A React + Tailwind CSS frontend for the AdsReader insights monitoring application.

## Features

- Authentication (Login, Signup, Forgot Password, Reset Password)
- Dashboard with metrics and charts
- Overview page with data table
- Analytics page with filters and multiple chart types
- Profile and Settings pages
- Responsive sidebar navigation
- Date range picker
- ApexCharts integration

## Tech Stack

- React 18
- React Router 6
- Tailwind CSS 3
- Vite
- Axios
- ApexCharts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Sidebar.jsx
│   ├── DateRangePicker.jsx
│   ├── Dropdown.jsx
│   ├── MetricCard.jsx
│   └── Chart.jsx
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── layouts/         # Layout components
│   └── DashboardLayout.jsx
├── pages/           # Page components
│   ├── auth/
│   └── dashboard/
├── services/        # API services
│   ├── api.js
│   └── auth.js
├── App.jsx
├── main.jsx
└── index.css
```

## API Configuration

The API base URL is configured in `src/services/api.js`. Default: `https://adsreader.onrender.com`

## Authentication

The app uses JWT tokens stored in localStorage with the key `access_token`.

