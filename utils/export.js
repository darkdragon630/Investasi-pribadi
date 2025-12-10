class ExportManager {
  static async exportToExcel(data, filename = 'luminarك-portfolio') {
    const wb = XLSX.utils.book_new();
    
    const investmentData = data.investments.map(inv => ({
      'Nama': inv.name,
      'Kategori': inv.category,
      'Status': inv.status,
      'Modal Awal': inv.initialCapital,
      'Modal Ditanam': inv.invested,
      'Nilai Sekarang': inv.currentValue,
      'Profit/Loss': parseFloat(inv.currentValue) - parseFloat(inv.invested || inv.initialCapital),
      'Mata Uang': inv.currency || 'IDR',
      'Tanggal Dibuat': new Date(inv.createdAt).toLocaleDateString('id-ID'),
      'Update Terakhir': new Date(inv.updatedAt).toLocaleDateString('id-ID')
    }));
    
    const ws1 = XLSX.utils.json_to_sheet(investmentData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Investasi');
    
    const transactionData = data.transactions.map(tx => ({
      'Tanggal': new Date(tx.createdAt).toLocaleDateString('id-ID'),
      'Tipe': tx.type,
      'Investasi': tx.investmentName,
      'Jumlah': tx.amount,
      'Harga': tx.price,
      'Total': tx.total,
      'Catatan': tx.notes || ''
    }));
    
    const ws2 = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Transaksi');
    
    const portfolio = await Calculator.calculateTotalPortfolio(data.investments);
    const summaryData = [
      { 'Metrik': 'Total Modal', 'Nilai': portfolio.totalCapital },
      { 'Metrik': 'Total Nilai', 'Nilai': portfolio.totalValue },
      { 'Metrik': 'Total Profit', 'Nilai': portfolio.totalProfit },
      { 'Metrik': 'Total Loss', 'Nilai': portfolio.totalLoss },
      { 'Metrik': 'Net Profit', 'Nilai': portfolio.netProfit },
      { 'Metrik': 'Total Kas', 'Nilai': data.cash }
    ];
    
    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Ringkasan');
    
    XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  static async exportToPDF(data, filename = 'luminarك-portfolio') {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    
    doc.setFontSize(20);
    doc.text('LuminarK Holdings', 105, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text('Laporan Portofolio Investasi', 105, yPos, { align: 'center' });
    yPos += 5;
    
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 105, yPos, { align: 'center' });
    yPos += 15;
    
    const portfolio = await Calculator.calculateTotalPortfolio(data.investments);
    
    doc.setFontSize(14);
    doc.text('Ringkasan Portofolio', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Modal: ${Calculator.formatCurrency(portfolio.totalCapital)}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Nilai: ${Calculator.formatCurrency(portfolio.totalValue)}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Profit: ${Calculator.formatCurrency(portfolio.totalProfit)}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Loss: ${Calculator.formatCurrency(portfolio.totalLoss)}`, 20, yPos);
    yPos += 7;
    doc.text(`Net Profit: ${Calculator.formatCurrency(portfolio.netProfit)}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Kas: ${Calculator.formatCurrency(data.cash)}`, 20, yPos);
    yPos += 15;
    
    doc.setFontSize(14);
    doc.text('Daftar Investasi', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    data.investments.forEach((inv, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const profit = parseFloat(inv.currentValue) - parseFloat(inv.invested || inv.initialCapital);
      
      doc.text(`${index + 1}. ${inv.name}`, 20, yPos);
      yPos += 5;
      doc.text(`   Kategori: ${inv.category} | Status: ${inv.status}`, 20, yPos);
      yPos += 5;
      doc.text(`   Modal: ${Calculator.formatCurrency(inv.invested || inv.initialCapital)} | Nilai: ${Calculator.formatCurrency(inv.currentValue)}`, 20, yPos);
      yPos += 5;
      doc.text(`   Profit/Loss: ${Calculator.formatCurrency(profit)}`, 20, yPos);
      yPos += 8;
    });
    
    doc.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
  }

  static exportJSON(data, filename = 'luminarك-portfolio') {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

window.ExportManager = ExportManager;