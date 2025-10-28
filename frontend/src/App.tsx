import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspaces from './pages/Workspaces';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Members from './pages/Members';
import GitHubCallback from './pages/auth/GitHubCallback';
import GoogleCallback from './pages/auth/GoogleCallback';
import './App.css';

function App() {
  return (
    // <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))] transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback/github" element={<GitHubCallback />} />
              <Route path="/auth/callback/google" element={<GoogleCallback />} />
              <Route
                path="/workspaces"
                element={
                  <ProtectedRoute>
                    <Workspaces />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspaces/:workspaceId/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspaces/:workspaceId/members"
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspaces/:workspaceId/projects/:projectId/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/workspaces" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    // </ThemeProvider>
  );
}

export default App;
