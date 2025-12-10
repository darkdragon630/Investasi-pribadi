import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

function InvestmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadInvestment();
    loadTransactions();
  }, [id]);

  const loadInvestment = () => {
    const investments = window.storage.getInvestments();
    const found = investments.find(inv => inv.id === id);
    setInvestment(found);
  };

  const loadTransactions = () => {
    const allTransactions = window.storage.getTransactions();
    const filtered = allTransactions.filter(tx => tx.investmentId === id);
    setTransactions(filtered);
  };

  if (!investment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Memuat data investasi...</p>
        </div>
      </div>
    );
  }

  const profit = parseFloat(investment.currentValue) - parseFloat(investment.invested || investment.initialCapital);
  const profitPercentage = window.Calculator.calculateProfitPercentage(
    investment.currentValue,
    investment.initialCapital,
    investment.invested
  );

  return (
    <div className="min-h-screen">
      <window.Header />
      
      <main className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Portofolio
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="gradient-border rounded-[30px] p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-sm text-gray-400 uppercase tracking-wider">{investment.category}</span>
                  <h1 className="text-4xl font-bold text-white mt-2">{investment.name}</h1>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm ${
                  investment.status === 'Aktif' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {investment.status}
                </span>
              </div>

              {investment.description && (
                <p className="text-gray-300 mb-8">{investment.description}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Modal Awal</p>
                  <p className="text-lg font-bold text-white">
                    {window.Calculator.formatCurrency(investment.initialCapital)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Modal Ditanam</p>
                  <p className="text-lg font-bold text-white">
                    {window.Calculator.formatCurrency(investment.invested || investment.initialCapital)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Nilai Sekarang</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent">
                    {window.Calculator.formatCurrency(investment.currentValue)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-1">Profit/Loss</p>
                  <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}{window.Calculator.formatCurrency(profit)}
                  </p>
                  <p className={`text-xs ${profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>

              {investment.notes && (
                <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30 mb-8">
                  <h3 className="text-lg font-bold text-white mb-2">Catatan Admin</h3>
                  <p className="text-gray-300">{investment.notes}</p>
                </div>
              )}

              {investment.proofImages && investment.proofImages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4">Bukti Transaksi</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {investment.proofImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Bukti ${index + 1}`}
                        className="w-full h-40 object-cover rounded-2xl border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="gradient-border rounded-[30px] p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Informasi Detail</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Mata Uang</span>
                  <span className="text-white font-semibold">{investment.currency || 'IDR'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-gray-400">Tanggal Dibuat</span>
                  <span className="text-white font-semibold">
                    {new Date(investment.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Update Terakhir</span>
                  <span className="text-white font-semibold">
                    {new Date(investment.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="gradient-border rounded-[30px] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Timeline Transaksi</h3>
              {transactions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Belum ada transaksi</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.type === 'buy' ? 'Beli' : 'Jual'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-white font-bold">
                        {window.Calculator.formatCurrency(tx.total)}
                      </p>
                      {tx.notes && <p className="text-xs text-gray-400 mt-1">{tx.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <window.Footer />
      <window.ScrollToTop />
    </div>
  );
}

window.InvestmentDetail = InvestmentDetail;