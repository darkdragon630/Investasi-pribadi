class StorageManager {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem('luminarك_investments')) {
      const initialData = {
        investments: [],
        transactions: [],
        cash: 0,
        settings: {
          currency: 'IDR',
          version: '1.0.0',
          lastUpdate: new Date().toISOString()
        }
      };
      localStorage.setItem('luminarك_investments', JSON.stringify(initialData));
    }
  }

  getData() {
    const data = localStorage.getItem('luminarك_investments');
    return data ? JSON.parse(data) : null;
  }

  saveData(data) {
    data.settings.lastUpdate = new Date().toISOString();
    localStorage.setItem('luminarك_investments', JSON.stringify(data));
    this.backup();
  }

  getInvestments() {
    const data = this.getData();
    return data?.investments || [];
  }

  addInvestment(investment) {
    const data = this.getData();
    investment.id = Date.now().toString();
    investment.createdAt = new Date().toISOString();
    investment.updatedAt = new Date().toISOString();
    data.investments.push(investment);
    this.saveData(data);
    return investment;
  }

  updateInvestment(id, updates) {
    const data = this.getData();
    const index = data.investments.findIndex(inv => inv.id === id);
    if (index !== -1) {
      data.investments[index] = {
        ...data.investments[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData(data);
      return data.investments[index];
    }
    return null;
  }

  deleteInvestment(id) {
    const data = this.getData();
    data.investments = data.investments.filter(inv => inv.id !== id);
    this.saveData(data);
  }

  getTransactions() {
    const data = this.getData();
    return data?.transactions || [];
  }

  addTransaction(transaction) {
    const data = this.getData();
    transaction.id = Date.now().toString();
    transaction.createdAt = new Date().toISOString();
    data.transactions.push(transaction);
    this.saveData(data);
    return transaction;
  }

  getCash() {
    const data = this.getData();
    return data?.cash || 0;
  }

  updateCash(amount) {
    const data = this.getData();
    data.cash = parseFloat(amount);
    this.saveData(data);
  }

  backup() {
    const data = this.getData();
    const backupKey = `luminarك_backup_${new Date().toISOString().split('T')[0]}`;
    localStorage.setItem(backupKey, JSON.stringify(data));
    
    const backups = Object.keys(localStorage).filter(key => key.startsWith('luminarك_backup_'));
    if (backups.length > 7) {
      backups.sort();
      localStorage.removeItem(backups[0]);
    }
  }

  exportData() {
    return this.getData();
  }

  importData(data) {
    this.saveData(data);
  }
}

window.StorageManager = StorageManager;
window.storage = new StorageManager();