
import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Calendar, History } from 'lucide-react';
import { Transaction, TireItem } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  tires: TireItem[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, tires }) => {
  const groupedByDate: Record<string, Transaction[]> = {};
  
  transactions.forEach(tx => {
    const date = new Date(tx.date).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(tx);
  });

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-none">Log Aktivitas</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Riwayat Pergerakan Stok</p>
        </div>
        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
          <History size={16} />
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Calendar size={10} className="text-slate-400" />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{date}</h3>
              <div className="flex-1 h-[1px] bg-slate-100" />
            </div>
            
            <div className="space-y-2">
              {items.map(tx => {
                const tire = tires.find(t => t.id === tx.itemId);
                return (
                  <div key={tx.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${tx.type === 'IN' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {tx.type === 'IN' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-slate-900 truncate leading-tight">
                        {tire ? `${tire.brand} ${tire.model}` : 'Produk Dihapus'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {tx.note && (
                          <>
                            <span className="text-slate-200 text-[8px]">•</span>
                            <span className="text-[8px] font-bold text-blue-500 uppercase truncate max-w-[100px]">
                              {tx.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black ${tx.type === 'IN' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                      </p>
                      <p className="text-[7px] font-black text-slate-500 uppercase tracking-tighter">Unit</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-3">
            <History size={40} strokeWidth={1} className="opacity-50" />
            <div className="text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Belum Ada Log</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
