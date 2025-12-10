import React, { useState } from 'react';

function Reports() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const data = window.storage.exportData();
      
      if (format === 'excel') {
        await window.ExportManager.exportToExcel(data);
      } else if (format === 'pdf') {
        await window.ExportManager.exportToPDF(data);
      } else if (format === 'json') {
        window.ExportManager.exportJSON(data);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Gagal export data. Silakan coba lagi.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <window.Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#bb00ff] to-[#90b5ff] bg-clip-text text-transparent mb-4">
            Laporan & Export
          </h1>
          <p className="text-gray-400">Download laporan portofolio dalam berbagai format</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="gradient-border rounded-[30px] p-8 hover-lift">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Excel Report</h3>
              <p className="text-gray-400 text-sm">
                Export lengkap dengan sheet investasi, transaksi, dan ringkasan
              </p>
            </div>
            
            <button
              onClick={() => handleExport('excel')}
              disabled={exporting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Download Excel'}
            </button>
          </div>

          <div className="gradient-border rounded-[30px] p-8 hover-lift">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-4xl">
                📄
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">PDF Report</h3>
              <p className="text-gray-400 text-sm">
                Laporan profesional dalam format PDF untuk presentasi
              </p>
            </div>
            
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Download PDF'}
            </button>
          </div>

          <div className="gradient-border rounded-[30px] p-8 hover-lift">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl">
                💾
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">JSON Backup</h3>
              <p className="text-gray-400 text-sm">
                Backup data mentah dalam format JSON untuk restore
              </p>
            </div>
            
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="w-full btn-primary disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Download JSON'}
            </button>
          </div>
        </div>

        <div className="mt-12 gradient-border rounded-[30px] p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Apa yang Termasuk dalam Laporan?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Daftar Investasi
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Nama dan kategori investasi</li>
                <li>• Modal awal dan modal ditanam</li>
                <li>• Nilai sekarang dan profit/loss</li>
                <li>• Status aktif/ditutup</li>
                <li>• Tanggal dibuat dan update</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Transaksi
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Riwayat pembelian dan penjualan</li>
                <li>• Jumlah dan harga per transaksi</li>
                <li>• Total nilai transaksi</li>
                <li>• Tanggal transaksi</li>
                <li>• Catatan tambahan</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Profit & Loss
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Total profit per kategori</li>
                <li>• Total kerugian per kategori</li>
                <li>• Net profit keseluruhan</li>
                <li>• Persentase ROI</li>
                <li>• Perbandingan modal vs nilai</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Alokasi Aset
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Distribusi per kategori</li>
                <li>• Persentase alokasi</li>
                <li>• Jumlah investasi per kategori</li>
                <li>• Total kas tersedia</li>
                <li>• Total aset keseluruhan</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <window.Footer />
      <window.ScrollToTop />
    </div>
  );
}

window.Reports = Reports;