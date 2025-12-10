import React from 'react';

function StatsCard({ title, value, subtitle, icon, gradient = 'from-purple-500 to-blue-500', trend }) {
  return (
    <div className="gradient-border rounded-[30px] p-6 hover-lift animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl animate-pulse-glow`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm px-3 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(2)}%
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-1">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

window.StatsCard = StatsCard;