import React, { useState } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('investment');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Saham Indonesia',
    initialCapital: '',
    invested: '',
    currentValue: '',
    currency: 'IDR',
    status: 'Aktif',
    notes: ''
  });

  const [transactionData, setTransactionData] = useState({
    investmentId: '',
    type: 'buy',
    amount: '',
    price: '',
    notes: ''
  });

  const [cashAmount, setCashAmount] = useState('');
  const [investments, setInvestments] = useState([]);

  useState(() => {
    loadInvestments();
  }, []);

  const loadInvestments = () => {
    const data = window.storage.getInvestments();
    setInvestments(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitInvestment = (e) => {
    e.preventDefault();
    try {
      window.storage.addInvestment(formData);
      alert('Investasi berhasil ditambahkan!');
      setFormData({
        name: '',
        description: '',
        category: 'Saham Indonesia',
        initialCapital: '',
        invested: '',
        currentValue: '',
        currency: 'IDR',
        status: 'Aktif',
        notes: ''
      });
      loadInvestments();
    } catch (error) {
      alert('Gagal menambahkan investasi: ' + error.message);
    }
  };

  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    try {
      const investment = investments.find(inv => inv.id === transactionData.investmentId);
      
      const transaction = {
        ...transactionData,
        investmentName: investment?.name,
        total: parseFloat(transactionData.amount) * parseFloat(transactionData.price)
      };
      
      window.storage.addTransaction(transaction);
      alert('Transaksi berhasil ditambahkan!');
      setTransactionData({
        investmentId: '',
        type: 'buy',
        amount: '',
        price: '',
        notes: ''
      });
    } catch (error) {
      alert('Gagal menambahkan transaksi: ' + error.message);
    }
  };

  const handleUpdateCash = () => {
    try {
      window.storage.updateCash(cashAmount);
      alert('Saldo kas berhasil diupdate!');
      setCashAmount('');
    } catch (error) {
      alert('Gagal update kas: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Kelola investasi, transaksi, dan data portofolio</p>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto">
          {['investment', 'transaction', 'cash'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {tab === 'investment' && 'Tambah Investasi'}
              {tab === 'transaction' && 'Tambah Transaksi'}
              {tab === 'cash' && 'Update Kas'}
            </button>
          ))}
        </div>

        {activeTab === 'investment' && (
          <form onSubmit={handleSubmitInvestment} className="gradient-border rounded-[30px] p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Tambah Investasi Baru</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Nama Investasi *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="e.g., PT Telkom Indonesia"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Kategori *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                >
                  <option value="Saham Indonesia">Saham Indonesia</option>
                  <option value="Saham Luar Negeri">Saham Luar Negeri</option>
                  <option value="Reksadana">Reksadana</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Emas">Emas</option>
                  <option value="Obligasi">Obligasi</option>
                  <option value="Tabungan">Tabungan</option>
                  <option value="Properti">Properti</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Modal Awal *</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="initialCapital"
                  value={formData.initialCapital}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="e.g., 10000000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Modal Ditanam</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="invested"
                  value={formData.invested}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Optional, default sama dengan modal awal"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Nilai Sekarang *</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="currentValue"
                  value={formData.currentValue}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="e.g., 12500000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Mata Uang</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full"
                >
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Ditutup">Ditutup</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full"
                  placeholder="Deskripsi lengkap investasi..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Catatan Admin</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full"
                  placeholder="Catatan internal untuk investasi ini..."
                ></textarea>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary mt-6">
              Simpan Investasi
            </button>
          </form>
        )}

        {activeTab === 'transaction' && (
          <form onSubmit={handleSubmitTransaction} className="gradient-border rounded-[30px] p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Tambah Transaksi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Pilih Investasi *</label>
                <select
                  name="investmentId"
                  value={transactionData.investmentId}
                  onChange={handleTransactionChange}
                  required
                  className="w-full"
                >
                  <option value="">-- Pilih Investasi --</option>
                  {investments.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipe Transaksi *</label>
                <select
                  name="type"
                  value={transactionData.type}
                  onChange={handleTransactionChange}
                  required
                  className="w-full"
                >
                  <option value="buy">Pembelian</option>
                  <option value="sell">Penjualan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Jumlah *</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleTransactionChange}
                  required
                  className="w-full"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Harga per Unit *</label>
                <input
                  type="number"
                  step="0.00000001"
                  name="price"
                  value={transactionData.price}
                  onChange={handleTransactionChange}
                  required
                  className="w-full"
                  placeholder="e.g., 4500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Total</label>
                <input
                  type="text"
                  value={window.Calculator.formatCurrency(
                    (parseFloat(transactionData.amount) || 0) * (parseFloat(transactionData.price) || 0)
                  )}
                  disabled
                  className="w-full bg-white/5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Catatan</label>
                <textarea
                  name="notes"
                  value={transactionData.notes}
                  onChange={handleTransactionChange}
                  rows="3"
                  className="w-full"
                  placeholder="Catatan transaksi..."
                ></textarea>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary mt-6">
              Simpan Transaksi
            </button>
          </form>
        )}

        {activeTab === 'cash' && (
          <div className="gradient-border rounded-[30px] p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Update Saldo Kas</h2>
            
            <div className="max-w-md mx-auto">
              <label className="block text-sm text-gray-400 mb-2">Saldo Kas Baru</label>
              <input
                type="number"
                step="0.01"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                className="w-full mb-4"
                placeholder="e.g., 50000000"
              />
              
              <button onClick={handleUpdateCash} className="w-full btn-primary">
                Update Saldo Kas
              </button>

              <div className="mt-8 p-6 rounded-2xl bg-white/5">
                <p className="text-sm text-gray-400 mb-2">Saldo Kas Saat Ini</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent">
                  {window.Calculator.formatCurrency(window.storage.getCash())}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Kembali ke Halaman Utama
          </a>
        </div>
      </div>
    </div>
  );
}

window.AdminDashboard = AdminDashboard;