import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import Podcasts from './pages/Podcasts';
import Newsletter from './pages/Newsletter';
import JobBoard from './pages/JobBoard';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import CreateBlog from './pages/CreateBlog';
import AdminDashboard from './pages/AdminDashboard';
import ReadingList from './pages/ReadingList';
import ReadingHistory from './pages/ReadingHistory';
import Forums from './pages/Forums';
import WritingChallenges from './pages/WritingChallenges';
import PeerReview from './pages/PeerReview';
import PremiumPlans from './pages/PremiumPlans';
import OfflineLibrary from './pages/OfflineLibrary';
import ProtectedRoute from './components/ProtectedRoute';
import AccessibilityPanel from './components/AccessibilityPanel';
import { registerServiceWorker } from './utils/pwa';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  const { theme } = useTheme();
  
  React.useEffect(() => {
    registerServiceWorker();
  }, []);
  
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <SocketProvider>
        <Router basename="/">
          <div className="App">
            <ParticleBackground />
            <Header />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/jobs" element={<JobBoard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/reading-list" element={
                <ProtectedRoute>
                  <ReadingList />
                </ProtectedRoute>
              } />
              <Route path="/reading-history" element={
                <ProtectedRoute>
                  <ReadingHistory />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } />
              <Route path="/create/:id" element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/forums" element={<Forums />} />
              <Route path="/challenges" element={<WritingChallenges />} />
              <Route path="/peer-review" element={
                <ProtectedRoute>
                  <PeerReview />
                </ProtectedRoute>
              } />
              <Route path="/premium" element={<PremiumPlans />} />
              <Route path="/offline-library" element={
                <ProtectedRoute>
                  <OfflineLibrary />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <AccessibilityPanel />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;