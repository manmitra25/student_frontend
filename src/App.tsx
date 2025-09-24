import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import './styles/globals.css';
import { ThemeProvider } from './components/providers/ThemeProvider';

// Import pages
import LandingPage from './components/pages/LandingPage';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import WelcomePage from './components/pages/WelcomePage';
import Dashboard from './components/pages/Dashboard';
import ChatPage from './components/pages/ChatPage';
import ResourcesPage from './components/pages/ResourcesPage';
import CommunityPage from './components/pages/CommunityPage';
import BookingPage from './components/pages/BookingPage';
import JournalPage from './components/pages/JournalPage';
import ProfilePage from './components/pages/ProfilePage';
import CrisisPage from './components/pages/CrisisPage';
import AcademicTrackingPage from './components/pages/AcademicTrackingPage';
import StudyToolsPage from './components/pages/StudyToolsPage';
import CareerGuidancePage from './components/pages/CareerGuidancePage';
import HubPage from './components/pages/HubPage';
import HubDetailPage from './components/pages/HubDetailPage';
import MoodPage from './components/pages/MoodPage';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'counsellor';
  college: string;
  isNewUser?: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useApp();
  if (isAuthenticated && user?.isNewUser) {
    return <Navigate to="/welcome" replace />;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = user !== null;

  return (
    <ThemeProvider defaultTheme="system" storageKey="manmitra-theme">
      <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              } />
              
              {/* Welcome flow for new users */}
              <Route path="/welcome" element={
                <ProtectedRoute>
                  <WelcomePage />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
              <Route path="/chat/assessment" element={
                <ProtectedRoute>
                  <ChatPage assessmentMode={true} />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/resources/category/:categoryId" element={
                <ProtectedRoute>
                  <ResourcesPage />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              } />
              <Route path="/community/channel/:channelId" element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              } />
              <Route path="/booking" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/booking/counselor/:counselorId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/crisis" element={
                <CrisisPage />
              } />
              
              {/* New Student-Focused Features */}
              <Route path="/academic-tracking" element={
                <ProtectedRoute>
                  <AcademicTrackingPage />
                </ProtectedRoute>
              } />
              <Route path="/study-tools" element={
                <ProtectedRoute>
                  <StudyToolsPage />
                </ProtectedRoute>
              } />
              <Route path="/career-guidance" element={
                <ProtectedRoute>
                  <CareerGuidancePage />
                </ProtectedRoute>
              } />
              <Route path="/hub" element={
                <ProtectedRoute>
                  <HubPage />
                </ProtectedRoute>
              } />
              <Route path="/hub/:id" element={
                <ProtectedRoute>
                  <HubDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/mood" element={
                <ProtectedRoute>
                  <MoodPage />
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}