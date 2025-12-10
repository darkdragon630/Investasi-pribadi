import React, { useState, useEffect } from 'react';

function Portfolio() {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', 'Saham Indonesia', 'Saham Luar Negeri', 'Reksadana', 'Crypto', 'Emas', 'Obligasi', 'Tabungan', 'Properti'];

  useEffect(() => {
    loadInvestments();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [investments, searchQuery, categoryFilter, statusFilter, sortBy]);

  const loadInvestments = () => {
    const data = window.storage.getInvestments();
    setInvestments(data);
  };

  const filterAndSort = () => {
    let filtered = [...investments];

    if (searchQuery) {
      filtered = filtered.filter(inv =>
        inv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(inv => inv.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'profitDesc':
          return (parseFloat(b.currentValue) - parseFloat(b.invested || b.initialCapital)) -
                 (parseFloat(a.currentValue) - parseFloat(a.invested || a.initialCapital));
        case 'capitalDesc':
          return parseFloat(b.invested || b.initialCapital) - parseFloat(a.invested || a.initialCapital);
        default:
          return 0;
      }
    });

    setFilteredInvestments(filtered);
  };

  return (
    <div className="min-h-screen">
      <window.Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-4">
            Daftar Investasi
          </h1>
          <p className="text-gray-400">Kelola dan pantau semua investasi Anda</p>
        </div>

        <div className="glass-morphism rounded-[30px] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Cari investasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full">
              <option value="All">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Ditutup">Ditutup</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="profitDesc">Profit Terbesar</option>
              <option value="capitalDesc">Modal Terbesar</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Menampilkan {filteredInvestments.length} dari {investments.length} investasi
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff]' : 'bg-white/10'}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-[#bb00ff] to-[#90b5ff]' : 'bg-white/10'}`}
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {filteredInvestments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Tidak ada investasi</h3>
            <p className="text-gray-500">Mulai tambahkan investasi dari dashboard admin</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredInvestments.map((investment) => (
              <window.InvestmentCard 
                key={investment.id} 
                investment={investment}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      <window.Footer />
      <window.ScrollToTop />
    </div>
  );
}

window.Portfolio = Portfolio;