import React from 'react';
import { useNavigate } from 'react-router';

const categoryIcons = {
  'Saham Indonesia': '📈',
  'Saham Luar Negeri': '🌐',
  'Reksadana': '📊',
  'Crypto': '₿',
  'Emas': '🥇',
  'Obligasi': '📜',
  'Tabungan': '💰',
  'Properti': '🏢'
};

const categoryColors = {
  'Saham Indonesia': 'from-blue-500 to-blue-700',
  'Saham Luar Negeri': 'from-purple-500 to-purple-700',
  'Reksadana': 'from-green-500 to-green-700',
  'Crypto': 'from-orange-500 to-orange-700',
  'Emas': 'from-yellow-500 to-yellow-700',
  'Obligasi': 'from-red-500 to-red-700',
  'Tabungan': 'from-teal-500 to-teal-700',
  'Properti': 'from-pink-500 to-pink-700'
};

function InvestmentCard({ investment, viewMode = 'grid' }) {
  const navigate = useNavigate();
  
  const profit = parseFloat(investment.currentValue) - parseFloat(investment.invested || investment.initialCapital);
  const profitPercentage = window.Calculator.calculateProfitPercentage(
    investment.currentValue, 
    investment.initialCapital, 
    investment.invested
  );

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => navigate(`/investment/${investment.id}`)}
        className="glass-morphism rounded-2xl p-4 hover-lift cursor-pointer animate-slide-up"
      >
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryColors[investment.category]} flex items-center justify-center text-3xl`}>
            {categoryIcons[investment.category]}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                {investment.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                investment.status === 'Aktif' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {investment.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{investment.name}</h3>
          </div>

          <div className="text-right">
            <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profit >= 0 ? '+' : ''}{window.Calculator.formatCurrency(profit)}
            </p>
            <p className="text-sm text-gray-400">
              {window.Calculator.formatCurrency(investment.currentValue)}
            </p>
          </div>

          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate(`/investment/${investment.id}`)}
      className="gradient-border rounded-[30px] p-6 hover-lift cursor-pointer animate-slide-up"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryColors[investment.category]} flex items-center justify-center text-2xl animate-float`}>
          {categoryIcons[investment.category]}
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${
          investment.status === 'Aktif' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>
          {investment.status}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-xs text-gray-400 uppercase tracking-wider">{investment.category}</span>
        <h3 className="text-xl font-bold text-white mt-1 line-clamp-2">{investment.name}</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Nilai Sekarang</span>
          <span className="text-lg font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent">
            {window.Calculator.formatCurrency(investment.currentValue)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Profit/Loss</span>
          <div className="text-right">
            <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profit >= 0 ? '+' : ''}{window.Calculator.formatCurrency(profit)}
            </p>
            <p className={`text-xs ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10">
          <button className="w-full btn-primary text-sm py-2">
            Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}

window.InvestmentCard = InvestmentCard;