import React, { useState, useEffect } from 'react';

function Home() {
  const [stats, setStats] = useState({
    cash: 0,
    totalCapital: 0,
    totalValue: 0,
    portfolioCount: 0,
    totalProfit: 0,
    totalLoss: 0
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    const data = window.storage.getData();
    const portfolio = await window.Calculator.calculateTotalPortfolio(data.investments);
    
    setStats({
      cash: data.cash,
      totalCapital: portfolio.totalCapital,
      totalValue: portfolio.totalValue,
      portfolioCount: data.investments.filter(inv => inv.status === 'Aktif').length,
      totalProfit: portfolio.totalProfit,
      totalLoss: portfolio.totalLoss
    });
  };

  return (
    <div className="min-h-screen">
      <window.Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#bb00ff] via-[#ae75fb] to-[#90b5ff] bg-clip-text text-transparent mb-4 animate-gradient">
            LuminarK Holdings
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Portofolio Investasi Pribadi
          </p>
          <p className="text-lg text-gray-400 font-semibold">
            Muhammad Burhanudin Syaifullah Azmi
          </p>
          <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Data diperbarui secara real-time dari dashboard admin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <window.StatsCard
            title="Saldo Kas"
            value={window.Calculator.formatCurrency(stats.cash)}
            subtitle="Total cash available"
            icon="💰"
            gradient="from-green-500 to-emerald-600"
          />
          
          <window.StatsCard
            title="Total Investasi"
            value={window.Calculator.formatCurrency(stats.totalCapital)}
            subtitle="Modal yang ditanam"
            icon="📊"
            gradient="from-blue-500 to-cyan-600"
          />
          
          <window.StatsCard
            title="Nilai Investasi"
            value={window.Calculator.formatCurrency(stats.totalValue)}
            subtitle="Current portfolio value"
            icon="💎"
            gradient="from-purple-500 to-pink-600"
          />
          
          <window.StatsCard
            title="Jumlah Portofolio"
            value={stats.portfolioCount.toString()}
            subtitle="Investasi aktif"
            icon="📈"
            gradient="from-orange-500 to-red-600"
            trend={stats.totalProfit > 0 ? (stats.totalProfit / stats.totalCapital) * 100 : 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="gradient-border rounded-[30px] p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-6">
              Ringkasan Keuangan
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">
                <span className="text-gray-400">Total Aset</span>
                <span className="text-2xl font-bold text-white">
                  {window.Calculator.formatCurrency(stats.cash + stats.totalValue)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-green-500/10 border border-green-500/30">
                <span className="text-gray-400">Total Profit</span>
                <span className="text-2xl font-bold text-green-400">
                  +{window.Calculator.formatCurrency(stats.totalProfit)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                <span className="text-gray-400">Total Loss</span>
                <span className="text-2xl font-bold text-red-400">
                  -{window.Calculator.formatCurrency(stats.totalLoss)}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-gray-400">Net Profit</span>
                <span className={`text-2xl font-bold ${stats.totalProfit - stats.totalLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.totalProfit - stats.totalLoss >= 0 ? '+' : ''}
                  {window.Calculator.formatCurrency(stats.totalProfit - stats.totalLoss)}
                </span>
              </div>
            </div>
          </div>

          <window.ROICalculator />
        </div>

        <div className="text-center">
          <a 
            href="/portfolio" 
            className="inline-block btn-primary px-8 py-4 text-lg"
          >
            Lihat Semua Portofolio
          </a>
        </div>
      </main>

      <window.Footer />
      <window.ScrollToTop />
    </div>
  );
}

window.Home = Home;