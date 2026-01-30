
import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ShoppingBag, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { Transaction, Expense, TireItem } from '../types';

interface ReportViewProps {
  transactions: Transaction[];
  expenses: Expense[];
  tires: TireItem[];
}

type Period = 'DAILY' | 'WEEKLY' | 'MONTHLY';

const ReportView: React.FC<ReportViewProps> = ({ transactions, expenses, tires }) => {
  const [period, setPeriod] = useState<Period>('DAILY');
  const [expandSales, setExpandSales] = useState(false);
  const [expandExpenses, setExpandExpenses] = useState(false);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const filteredData = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const startOfWeek = new Date(d.setDate(diff)).setHours(0,0,0,0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const threshold = period === 'DAILY' ? startOfToday : (period === 'WEEKLY' ? startOfWeek : startOfMonth);

    const filteredTransactions = transactions.filter(t => new Date(t.date).getTime() >= threshold && t.type === 'OUT');
    const filteredExpenses = expenses.filter(e => new Date(e.date).getTime() >= threshold);

    const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + (curr.quantity * (curr.priceAtTransaction || 0)), 0);
    const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalGrossProfit = filteredTransactions.reduce((acc, curr) => {
      const tire = tires.find(item => item.id === curr.itemId);
      const purchasePrice = tire?.purchasePrice || 0;
      const sellPrice = curr.priceAtTransaction || 0;
      return acc + (curr.quantity * (sellPrice - purchasePrice));
    }, 0);

    const netProfit = totalGrossProfit - totalExpenses;

    return { 
      totalRevenue, 
      totalExpenses, 
      netProfit, 
      transactionCount: filteredTransactions.length,
      filteredTransactions,
      filteredExpenses
    };
  }, [period, transactions, expenses, tires]);

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      <div className="px-1">
        <h2 className="text-lg font-black text-slate-900 leading-none">Laporan Keuangan</h2>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Omzet & Pengeluaran Toko</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        {(['DAILY', 'WEEKLY', 'MONTHLY'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
              period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
            }`}
          >
            {p === 'DAILY' ? 'Hari Ini' : p === 'WEEKLY' ? 'Minggu' : 'Bulan'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {/* Main Omzet Card */}
        <div className="bg-emerald-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <TrendingUp className="absolute top-2 right-2 opacity-10" size={32} />
          <p className="text-[9px] font-black uppercase tracking-wider opacity-80 mb-0.5">Omzet Penjualan</p>
          <h3 className="text-2xl font-black">Rp {formatIDR(filteredData.totalRevenue)}</h3>
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
             <ShoppingBag size={10} className="opacity-70" />
             <p className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">{filteredData.transactionCount} Item Terjual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-rose-100 rounded-2xl p-3.5 shadow-sm">
            <p className="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Total Biaya</p>
            <p className="text-[13px] font-black text-rose-600">Rp {formatIDR(filteredData.totalExpenses)}</p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-3.5 shadow-md">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Laba Bersih</p>
            <p className="text-[13px] font-black text-emerald-400">Rp {formatIDR(filteredData.netProfit)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Compact Sales Breakdown */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <button 
            onClick={() => setExpandSales(!expandSales)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-slate-900 uppercase">Rincian Penjualan</span>
            </div>
            {expandSales ? <ChevronUp size={14} className="text-slate-300" /> : <ChevronDown size={14} className="text-slate-300" />}
          </button>
          
          {expandSales && (
            <div className="px-4 pb-3 space-y-2 max-h-48 overflow-y-auto border-t border-slate-50 animate-in slide-in-from-top-1">
              {filteredData.filteredTransactions.length > 0 ? filteredData.filteredTransactions.map(tx => {
                const tire = tires.find(t => t.id === tx.itemId);
                return (
                  <div key={tx.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-900 truncate">{tire?.brand} {tire?.model}</p>
                      <p className="text-[8px] text-slate-400 uppercase">{tx.quantity} unit @ {formatIDR(tx.priceAtTransaction || 0)}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-900">Rp {formatIDR((tx.priceAtTransaction || 0) * tx.quantity)}</span>
                  </div>
                );
              }) : <p className="text-[9px] text-slate-400 italic text-center py-3">Kosong</p>}
            </div>
          )}
        </div>

        {/* Compact Expense Breakdown */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <button 
            onClick={() => setExpandExpenses(!expandExpenses)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Receipt size={14} className="text-rose-500" />
              <span className="text-[9px] font-black text-slate-900 uppercase">Rincian Biaya</span>
            </div>
            {expandExpenses ? <ChevronUp size={14} className="text-slate-300" /> : <ChevronDown size={14} className="text-slate-300" />}
          </button>
          
          {expandExpenses && (
            <div className="px-4 pb-3 space-y-2 max-h-48 overflow-y-auto border-t border-slate-50 animate-in slide-in-from-top-1">
              {filteredData.filteredExpenses.length > 0 ? filteredData.filteredExpenses.map(e => (
                <div key={e.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 truncate">{e.title}</p>
                    <p className="text-[8px] text-slate-400 uppercase tracking-tighter">{e.category}</p>
                  </div>
                  <span className="text-[10px] font-black text-rose-600">-Rp {formatIDR(e.amount)}</span>
                </div>
              )) : <p className="text-[9px] text-slate-400 italic text-center py-3">Kosong</p>}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
        <ArrowUpRight size={14} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[9px] text-blue-700 font-medium leading-relaxed">
          {filteredData.netProfit > 0 
            ? `Bagus! Laba bersih periode ini Rp ${formatIDR(filteredData.netProfit)}.` 
            : 'Perhatikan pengeluaran untuk meningkatkan profitabilitas toko.'}
        </p>
      </div>
    </div>
  );
};

export default ReportView;
