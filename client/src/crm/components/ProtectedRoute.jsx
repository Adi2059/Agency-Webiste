import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check karrte hain local storage mein token hai ya nahi
  const token = localStorage.getItem('afterus_token');

  if (!token) {
    // Token nahi hai, login par bhejo
    return <Navigate to="/login" replace />;
  }

  // Token hai, dashboard dikhao
  return children;
};

export default ProtectedRoute;