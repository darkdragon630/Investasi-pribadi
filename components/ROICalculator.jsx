import React, { useState } from 'react';

function ROICalculator() {
  const [initial, setInitial] = useState('');
  const [final, setFinal] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const roi = window.Calculator.calculateROI(initial, final);
    const profit = parseFloat(final) - parseFloat(initial);
    setResult({ roi, profit });
  };

  return (
    <div id="calculator" className="gradient-border rounded-[30px] p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-6">
        Kalkulator ROI
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Investasi Awal</label>
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            placeholder="Masukkan nominal awal"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Nilai Akhir</label>
          <input
            type="number"
            value={final}
            onChange={(e) => setFinal(e.target.value)}
            placeholder="Masukkan nilai akhir"
            className="w-full"
          />
        </div>

        <button onClick={calculate} className="w-full btn-primary">
          Hitung ROI
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">ROI</span>
              <span className={`text-2xl font-bold ${result.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Profit/Loss</span>
              <span className={`text-xl font-bold ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {window.Calculator.formatCurrency(result.profit)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.ROICalculator = ROICalculator;