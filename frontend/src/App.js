import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReviewForm from './components/ReviewForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import PaperDetails from './components/PaperDetails';
import AdminDashboard from './components/AdminDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';

function RequireAuth({ children }) {
  const token = localStorage.getItem('userType');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/papers/:id" element={<PaperDetails />} />
      <Route path="/register" element={
        <div>
          <RegisterForm />
        </div>} />
      <Route
        path="/reviewerDashboard"
        element={
          <RequireAuth>
            <ReviewerDashboard />
          </RequireAuth>
        }
      />
        <Route
        path="/dashboardAdmin"
        element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      /> 

    <Route path="/review/new/:paperId" element={<ReviewForm />} />
    <Route path="/reviews/edit/:id" element={<ReviewForm />} />
    <Route path="*" element={<h2>Страница не найдена</h2>} />
    </Routes>
  );
}

export default App;