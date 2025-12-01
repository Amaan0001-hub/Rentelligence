'use client'

import { Toaster } from 'react-hot-toast';

const GradientToast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          background: 'linear-gradient(90deg, #FF4D4D 0%, #F9CB28 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          fontSize: '14px',
        },
        success: {
          style: {
            background: 'linear-gradient(90deg, #4ade80 0%, #3b82f6 100%)',
          },
        },
        error: {
          style: {
            background: 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
          },
        },
      }}
    />
  );
};

export default GradientToast;