# FashionGen - AI-Powered Virtual Wardrobe Studio

A modern React-based AI fashion application that enables users to generate virtual wardrobe overlays and style recommendations using Google's Gemini AI. Built with cutting-edge technologies for a premium fashion experience.

## 🚀 Features

### AI-Powered Fashion
- **Google Gemini AI Integration** - Advanced AI fashion analysis and style generation
- **Virtual Wardrobe Overlays** - Real-time fashion styling with pose preservation
- **Multi-Style Generation** - Support for various fashion styles and creativity levels
- **Inspiration Mode** - Upload reference images for style transfer

### Modern Tech Stack
- **React 18** - Latest React with concurrent features and Suspense
- **Vite** - Lightning-fast build tool with optimized code splitting
- **Supabase** - Backend-as-a-service with authentication and real-time database
- **Stripe Integration** - Secure payment processing for subscriptions
- **TailwindCSS** - Utility-first CSS with custom fashion-forward design system
- **Framer Motion** - Smooth animations and micro-interactions

### Business Features
- **Subscription Management** - Multiple tiers with credit-based usage
- **User Dashboard** - Comprehensive analytics and usage tracking
- **Portfolio System** - Save and manage generated fashion content
- **Admin Panel** - Complete administrative control and monitoring

## 🎭 Demo Accounts

For testing and demonstration purposes, you can use these pre-configured accounts:

### Admin Demo Account
- **Email:** `admin@fashiongen.demo`
- **Password:** `admin123`
- **Features:** Full administrative access, 10,000 API credits, advanced dashboard

### Customer Demo Account  
- **Email:** `customer@fashiongen.demo`
- **Password:** `customer123`
- **Features:** Professional subscription, 300 API credits, standard features

> **Note:** These demo accounts are created automatically when you run the database migrations. They include sample data and transaction history for testing purposes.

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Supabase account (for backend services)
- Google AI Studio account (for Gemini API)
- Stripe account (for payment processing)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fashiongen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   ```env
   # Supabase
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Google Gemini AI
   VITE_GEMINI_API_KEY=your-gemini-api-key
   
   # Stripe (for payments)
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   ```

4. **Set up Supabase database:**
   - Run the migrations in your Supabase project
   - The demo accounts will be created automatically

5. **Start the development server:**
   ```bash
   npm run start
   # or
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new
