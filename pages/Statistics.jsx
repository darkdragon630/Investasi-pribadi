import React, { useState, useEffect, useRef } from 'react';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  useEffect(() => {
    if (stats && categoryStats.length > 0) {
      renderCharts();
    }
  }, [stats, categoryStats]);

  const loadStatistics = async () => {
    const data = window.storage.getData();
    const portfolio = await window.Calculator.calculateTotalPortfolio(data.investments);
    const catStats = await window.Calculator.calculateCategoryStats(data.investments);
    
    setStats(portfolio);
    setCategoryStats(catStats);
  };

  const renderCharts = () => {
    if (pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryStats.map(cat => cat.category),
          datasets: [{
            data: categoryStats.map(cat => cat.totalValue),
            backgroundColor: [
              '#bb00ff',
              '#90b5ff',
              '#6a00ff',
              '#ae75fb',
              '#ff6b9d',
              '#ffd700',
              '#00ff88',
              '#ff4444'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#fff',
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + window.Calculator.formatCurrency(context.parsed);
                }
              }
            }
          }
        }
      });
    }

    if (lineChartRef.current) {
      const ctx = lineChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: categoryStats.map(cat => cat.category),
          datasets: [
            {
              label: 'Modal',
              data: categoryStats.map(cat => cat.totalCapital),
              borderColor: '#90b5ff',
              backgroundColor: 'rgba(144, 181, 255, 0.1)',
              tension: 0.4
            },
            {
              label: 'Nilai Sekarang',
              data: categoryStats.map(cat => cat.totalValue),
              borderColor: '#bb00ff',
              backgroundColor: 'rgba(187, 0, 255, 0.1)',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#fff'
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: '#999',
                callback: function(value) {
                  return 'Rp ' + (value / 1000000).toFixed(0) + 'M';
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#999'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }

    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categoryStats.map(cat => cat.category),
          datasets: [{
            label: 'Profit/Loss',
            data: categoryStats.map(cat => cat.profit),
            backgroundColor: categoryStats.map(cat => 
              cat.profit >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
            )
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#fff'
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color: '#999',
                callback: function(value) {
                  return window.Calculator.formatCurrency(value);
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: '#999'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400">Memuat statistik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <window.Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-4">
            Statistik Portofolio
          </h1>
          <p className="text-gray-400">Analisis lengkap performa investasi Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="gradient-border rounded-[30px] p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Total Aset</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent">
              {window.Calculator.formatCurrency(stats.totalValue)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Modal: {window.Calculator.formatCurrency(stats.totalCapital)}
            </p>
          </div>

          <div className="gradient-border rounded-[30px] p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">Net Profit</h3>
            <p className={`text-3xl font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.netProfit >= 0 ? '+' : ''}{window.Calculator.formatCurrency(stats.netProfit)}
            </p>
            <p className={`text-sm mt-2 ${
              stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.totalCapital > 0 
                ? `${((stats.netProfit / stats.totalCapital) * 100).toFixed(2)}%` 
                : '0%'
              }
            </p>
          </div>

          <div className="gradient-border rounded-[30px] p-6">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-2">ROI</h3>
            <p className={`text-3xl font-bold ${
              stats.totalValue >= stats.totalCapital ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.totalCapital > 0 
                ? `${(((stats.totalValue - stats.totalCapital) / stats.totalCapital) * 100).toFixed(2)}%`
                : '0%'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">Return on Investment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="gradient-border rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Alokasi Aset per Kategori</h2>
            <div className="chart-container">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>

          <div className="gradient-border rounded-[30px] p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Profit/Loss per Kategori</h2>
            <div className="chart-container">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="gradient-border rounded-[30px] p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Perbandingan Modal vs Nilai</h2>
          <div className="chart-container">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>

        <div className="gradient-border rounded-[30px] p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Detail per Kategori</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Kategori</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Jumlah</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Modal</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Nilai</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">Profit/Loss</th>
                  <th className="text-right py-4 px-4 text-gray-400 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((cat) => (
                  <tr key={cat.category} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4 text-white font-semibold">{cat.category}</td>
                    <td className="py-4 px-4 text-right text-gray-300">{cat.count}</td>
                    <td className="py-4 px-4 text-right text-gray-300">
                      {window.Calculator.formatCurrency(cat.totalCapital)}
                    </td>
                    <td className="py-4 px-4 text-right text-white font-semibold">
                      {window.Calculator.formatCurrency(cat.totalValue)}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      cat.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {cat.profit >= 0 ? '+' : ''}{window.Calculator.formatCurrency(cat.profit)}
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      cat.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {cat.profitPercentage >= 0 ? '+' : ''}{cat.profitPercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <window.Footer />
      <window.ScrollToTop />
    </div>
  );
}

window.Statistics = Statistics;