import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      if (
        window.StorageManager &&
        window.Calculator &&
        window.ExportManager &&
        window.Header &&
        window.Footer &&
        window.InvestmentCard &&
        window.StatsCard &&
        window.ROICalculator &&
        window.ScrollToTop &&
        window.Home &&
        window.Portfolio &&
        window.InvestmentDetail &&
        window.Statistics &&
        window.Reports &&
        window.AdminDashboard
      ) {
        setIsReady(true);
      }
    };

    checkDependencies();
    const interval = setInterval(checkDependencies, 100);
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#bb00ff] mb-4"></div>
        <p className="text-gray-400 text-lg">Memuat LuminarK Holdings...</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<window.Home />} />
        <Route path="/portfolio" element={<window.Portfolio />} />
        <Route path="/investment/:id" element={<window.InvestmentDetail />} />
        <Route path="/statistics" element={<window.Statistics />} />
        <Route path="/reports" element={<window.Reports />} />
        <Route path="/admin-luminarك-dashboard-2024" element={<window.AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);