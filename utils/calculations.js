class Calculator {
  static async getExchangeRate(from = 'USD', to = 'IDR') {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      return data.rates[to] || 15000;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return 15000;
    }
  }

  static async convertToIDR(amount, currency = 'USD') {
    if (currency === 'IDR') return amount;
    const rate = await this.getExchangeRate(currency, 'IDR');
    return amount * rate;
  }

  static calculateProfit(currentValue, initialCapital, invested) {
    const totalInvested = parseFloat(invested || initialCapital);
    return parseFloat(currentValue) - totalInvested;
  }

  static calculateProfitPercentage(currentValue, initialCapital, invested) {
    const totalInvested = parseFloat(invested || initialCapital);
    if (totalInvested === 0) return 0;
    return ((parseFloat(currentValue) - totalInvested) / totalInvested) * 100;
  }

  static async calculateTotalPortfolio(investments) {
    let totalCapital = 0;
    let totalValue = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    for (const inv of investments) {
      const capital = parseFloat(inv.invested || inv.initialCapital || 0);
      let value = parseFloat(inv.currentValue || 0);

      if (inv.currency && inv.currency !== 'IDR') {
        value = await this.convertToIDR(value, inv.currency);
      }

      totalCapital += capital;
      totalValue += value;

      const profit = value - capital;
      if (profit > 0) {
        totalProfit += profit;
      } else {
        totalLoss += Math.abs(profit);
      }
    }

    return {
      totalCapital,
      totalValue,
      totalProfit,
      totalLoss,
      netProfit: totalProfit - totalLoss
    };
  }

  static formatCurrency(amount, currency = 'IDR') {
    const num = parseFloat(amount) || 0;
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(num);
  }

  static formatNumber(number, decimals = 2) {
    return parseFloat(number).toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  static calculateROI(initialInvestment, finalValue) {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    if (initial === 0) return 0;
    return ((final - initial) / initial) * 100;
  }

  static groupByCategory(investments) {
    const grouped = {};
    investments.forEach(inv => {
      if (!grouped[inv.category]) {
        grouped[inv.category] = [];
      }
      grouped[inv.category].push(inv);
    });
    return grouped;
  }

  static async calculateCategoryStats(investments) {
    const grouped = this.groupByCategory(investments);
    const stats = [];

    for (const [category, items] of Object.entries(grouped)) {
      let totalCapital = 0;
      let totalValue = 0;

      for (const item of items) {
        totalCapital += parseFloat(item.invested || item.initialCapital || 0);
        let value = parseFloat(item.currentValue || 0);
        if (item.currency && item.currency !== 'IDR') {
          value = await this.convertToIDR(value, item.currency);
        }
        totalValue += value;
      }

      stats.push({
        category,
        count: items.length,
        totalCapital,
        totalValue,
        profit: totalValue - totalCapital,
        profitPercentage: totalCapital > 0 ? ((totalValue - totalCapital) / totalCapital) * 100 : 0
      });
    }

    return stats;
  }
}

window.Calculator = Calculator;