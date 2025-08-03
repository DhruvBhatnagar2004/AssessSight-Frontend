# 🔍 Web Accessibility Analyzer - Frontend

> **Making the web accessible for everyone, one scan at a time.**

A modern Next.js frontend application for web accessibility analysis. This frontend connects to a separate backend API to provide comprehensive accessibility scanning, detailed reports, and user management features.

## ✨ Features

### 🚀 **Comprehensive Scanning Interface**
- **Real-time Analysis**: Clean interface to scan any website URL instantly
- **WCAG Compliance Reports**: Display results against WCAG 2.1 AA/AAA standards
- **Multiple Issue Types**: Visual representation of color contrast, alt text, keyboard navigation issues
- **Detailed Reports**: Comprehensive analysis with severity levels and actionable insights

### 📊 **Visual Analytics Dashboard**
- **Interactive Charts**: Beautiful pie charts, bar graphs, and trend analysis using Recharts
- **Severity Breakdown**: Critical, Warning, and Info level categorization with color coding
- **Issue Distribution**: Visual representation of which elements need attention
- **Progress Tracking**: Monitor improvements over time with historical data

### 🔧 **Smart Fix Suggestions**
- **Automated Solutions**: Display AI-powered fix suggestions from backend
- **Code Examples**: Show ready-to-use code snippets for common issues
- **Best Practices**: Learn accessibility guidelines while reviewing fixes
- **Export Options**: Download reports in multiple formats

### 👤 **User Management Interface**
- **Secure Authentication**: JWT-based login system with password visibility toggle
- **Scan History**: Track and display all previous scans
- **Personal Dashboard**: Manage accessibility projects with clean UI
- **Progress Analytics**: Visualize improvement over time with charts

### 🎨 **Modern UI/UX**
- **Dark Theme**: Sleek dark interface built with Tailwind CSS
- **Responsive Design**: Works perfectly on all devices (mobile-first approach)
- **Smooth Animations**: Engaging user experience with micro-interactions
- **Intuitive Navigation**: Clean and user-friendly interface design

## 🛠️ Tech Stack

**Frontend Technologies:**
- **Next.js 14** (App Router) - React framework with server-side rendering
- **React 18** - Component-based UI library
- **JavaScript (ES6+)** - Modern JavaScript without TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library for React
- **Heroicons** - Beautiful hand-crafted SVG icons

**Development Tools:**
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- Access to the backend API (separate repository)
- Git

### Installation

1. **Clone the frontend repository**
   ```bash
   git clone <your-frontend-repo-url>
   cd web-accessibility-analyzer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   > **Note**: Make sure your backend API is running on the specified URL. The backend repository contains the Express.js API with MongoDB integration.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` and start using the analyzer! 🎉

### Backend Requirements

This frontend requires a backend API that provides:
- User authentication endpoints (`/api/auth/login`, `/api/auth/register`)
- Accessibility scanning endpoint (`/api/scan`)
- Scan history endpoints (`/api/scan-history`)
- User management endpoints

The backend is maintained in a separate repository and should be running for full functionality.

## 📖 How to Use

### 🔍 **Scanning a Website**
1. Enter any website URL in the search bar
2. Click "Analyze" and wait for the analysis to complete
3. View your detailed accessibility report with interactive charts
4. Get actionable fix suggestions for each issue found

### 📊 **Understanding Reports**
- **Critical Issues** (Red): Must-fix accessibility barriers
- **Warnings** (Orange): Important improvements for better accessibility  
- **Info** (Blue): Best practice recommendations and minor suggestions

### 🔧 **Viewing Fix Suggestions**
1. Click on any issue in the results table
2. View detailed information about the accessibility problem
3. See suggested fixes with code examples
4. Apply fixes to your website and re-scan to verify improvements

### 📈 **User Features**
- Create an account to save scan history
- Track progress over time with visual analytics
- Export reports for documentation and team sharing
- View detailed analytics with interactive charts and filters

## 🌟 Frontend Highlights

This frontend application demonstrates:

- **Modern React Development**: Hooks, Context API, and functional components
- **Next.js App Router**: Latest Next.js features with server components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: Clean integration with backend RESTful APIs
- **State Management**: React Context for authentication and global state
- **Data Visualization**: Interactive charts and analytics with Recharts
- **Form Handling**: Proper validation and error handling
- **UI/UX Design**: Modern dark theme with smooth animations
- **Accessibility**: Built following accessibility best practices

## 📁 Project Structure

```
web-accessibility-analyzer-frontend/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.js          # Root layout component
│   │   ├── page.js            # Home page
│   │   └── history/           # Scan history page
│   ├── components/            # Reusable React components
│   │   ├── Charts.jsx         # Data visualization components
│   │   ├── Header.jsx         # Navigation header
│   │   ├── LoginModal.jsx     # Login form modal
│   │   ├── RegisterModal.jsx  # Registration form modal
│   │   ├── IssuesTable.jsx    # Results table component
│   │   └── ...                # Other UI components
│   ├── context/               # React context providers
│   │   └── AuthContext.js     # Authentication state management
│   └── lib/                   # Utility functions and API calls
│       ├── api.js             # API integration functions
│       └── utils.js           # Helper utilities
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## 🔧 Key Features Implemented

### Frontend Components
- ✅ Responsive navigation with mobile menu
- ✅ Interactive data visualization with Recharts
- ✅ Modal components for authentication
- ✅ Form validation and error handling
- ✅ Password visibility toggle with eye icons
- ✅ Loading states and smooth animations
- ✅ Dark theme with Tailwind CSS
- ✅ Accessibility-focused design

### API Integration
- ✅ Axios-based API client with error handling
- ✅ JWT token management and storage
- ✅ Request/response interceptors
- ✅ Environment-based configuration
- ✅ Proper error boundaries and fallbacks

## 🚦 Development Status

This frontend application is complete and ready for production. Current status:

- ✅ **Core UI Components**: Complete
- ✅ **User Authentication Interface**: Complete
- ✅ **Accessibility Scanning Interface**: Complete
- ✅ **Data Visualization**: Complete
- ✅ **Responsive Design**: Complete
- ✅ **API Integration**: Complete
- 🔄 **Additional UI Enhancements**: Ongoing

## 📝 Future Frontend Enhancements

- [ ] Progressive Web App (PWA) features
- [ ] Advanced filtering and search in scan history
- [ ] Drag-and-drop file upload for batch scanning
- [ ] Real-time notifications for scan completion
- [ ] Advanced data export options (PDF, Excel)
- [ ] Customizable dashboard themes
- [ ] Keyboard shortcuts for power users

## 🎯 Learning Outcomes

Through this frontend project, I've demonstrated expertise in:

- Modern React development with hooks and context
- Next.js App Router and server-side rendering
- Responsive web design with Tailwind CSS
- Data visualization and interactive charts
- Form handling and validation
- API integration and state management
- Authentication flows and JWT handling
- Component architecture and reusability
- Performance optimization and code splitting
- Accessibility implementation and best practices

## 🔗 Related Repositories

- **Backend API**: [[Link to backend repository](https://github.com/DhruvBhatnagar2004/AssessSight-Backend)] - Express.js API with MongoDB


<div align="center">


![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

⭐ **Star this repo if you found it helpful!** ⭐

</div>
