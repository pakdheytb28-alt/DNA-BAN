
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Package, AlertTriangle, ChevronRight, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { TireItem, Transaction, ViewState, Expense } from '../types';

interface DashboardProps {
  tires: TireItem[];
  transactions: Transaction[];
  expenses: Expense[];
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tires, transactions, expenses, onNavigate }) => {
  const totalItems = tires.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStock = tires.filter(t => t.stock <= t.minStock);
  
  const totalInventoryValue = tires.reduce((acc, curr) => acc + (curr.stock * curr.price), 0);
  const totalCapital = tires.reduce((acc, curr) => acc + (curr.stock * curr.purchasePrice), 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-500">
      {/* Compact Valuation Hero */}
      <div className="relative p-5 bg-slate-900 rounded-2xl text-white shadow-lg overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nilai Stok (Jual)</p>
            <h2 className="text-2xl font-black tracking-tight">Rp {formatIDR(totalInventoryValue)}</h2>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <Banknote size={20} className="text-emerald-400" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center relative z-10">
          <div>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Modal Aktif</p>
            <p className="text-sm font-bold text-slate-200">Rp {formatIDR(totalCapital)}</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ShieldCheck size={10} className="text-emerald-500" />
            <span className="text-[8px] font-black text-emerald-400 uppercase">Sistem Aman</span>
          </div>
        </div>
      </div>

      {/* Compact Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="bg-blue-50 w-9 h-9 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
            <Package size={18} />
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Total Ban</p>
            <p className="text-lg font-black text-slate-900 leading-none">{totalItems}</p>
          </div>
        </div>

        <div onClick={() => onNavigate('INVENTORY')} className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition-transform active:scale-95 ${lowStock.length > 0 ? 'bg-orange-50/30 border-orange-100' : 'bg-white border-slate-100'}`}>
          <div className={`${lowStock.length > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-500'} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Limit Stok</p>
            <p className={`text-lg font-black leading-none ${lowStock.length > 0 ? 'text-orange-600' : 'text-slate-900'}`}>{lowStock.length}</p>
          </div>
        </div>
      </div>

      {/* Minimalist Analytics Link */}
      <button 
        onClick={() => onNavigate('REPORTS')}
        className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center justify-between group active:bg-slate-50 transition-all shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white w-9 h-9 rounded-lg flex items-center justify-center">
            <Wallet size={16} />
          </div>
          <p className="text-xs font-bold text-slate-900">Analisis Keuangan Laba/Rugi</p>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Simplified Activity Log */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Aktivitas Terbaru</h2>
          <button onClick={() => onNavigate('HISTORY')} className="text-[9px] text-blue-600 font-bold uppercase tracking-wider">Lihat Semua</button>
        </div>
        <div className="space-y-2">
          {transactions.slice(0, 4).length > 0 ? transactions.slice(0, 4).map(tx => {
            const tire = tires.find(t => t.id === tx.itemId);
            return (
              <div key={tx.id} className="bg-white p-3 rounded-xl flex items-center gap-3 border border-slate-50 shadow-sm">
                <div className={`p-1.5 rounded-lg ${tx.type === 'IN' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {tx.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{tire?.brand} {tire?.model}</p>
                  <p className="text-[8px] text-slate-500 mt-0.5">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.type === 'IN' ? 'Masuk' : 'Terjual'}</p>
                </div>
                <p className={`text-[12px] font-black ${tx.type === 'IN' ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                </p>
              </div>
            );
          }) : (
            <div className="text-center py-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100">
               <p className="text-[9px] font-bold text-slate-300 uppercase italic">Kosong</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
