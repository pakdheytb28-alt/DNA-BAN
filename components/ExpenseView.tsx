
import React, { useState } from 'react';
import { Receipt, Plus, Trash2, X, Check, DollarSign, Layers } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseViewProps {
  expenses: Expense[];
  onAdd: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: Expense['category'][] = ['Operasional', 'Sewa', 'Listrik', 'Gaji', 'Lainnya'];

const ExpenseView: React.FC<ExpenseViewProps> = ({ expenses, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id' | 'date'>>({
    title: '',
    amount: 0,
    category: 'Operasional'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || newExpense.amount <= 0) return;

    onAdd({
      ...newExpense,
      id: Date.now().toString(),
      date: new Date().toISOString()
    });
    setNewExpense({ title: '', amount: 0, category: 'Operasional' });
    setShowForm(false);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-black text-slate-900">Catatan Biaya</h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Input Pengeluaran Toko</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-rose-500 text-white p-2 rounded-xl shadow-md active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase">Input Biaya Baru</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-300 p-1"><X size={16} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Keterangan</label>
              <input 
                type="text"
                placeholder="Listrik, Gaji, dll..."
                value={newExpense.title}
                onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Kategori</label>
                <div className="relative">
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-3 text-[11px] font-bold text-slate-900 appearance-none outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Layers size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Nominal (Rp)</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2.5 px-3 text-[12px] font-black text-rose-500 outline-none"
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md">
              <Check size={16} /> Simpan Pengeluaran
            </button>
          </form>
        </div>
      )}

      <div className="space-y-2 pb-10">
        {expenses.length > 0 ? expenses.map(e => (
          <div key={e.id} className="bg-white p-3 rounded-xl border border-slate-50 shadow-sm flex items-center gap-3 group active:bg-slate-50">
            <div className="bg-rose-50 text-rose-500 p-2 rounded-lg shrink-0">
              <Receipt size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[7px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">{e.category}</span>
                <span className="text-[7px] text-slate-300 font-bold">{new Date(e.date).toLocaleDateString('id-ID')}</span>
              </div>
              <p className="text-[12px] font-black text-slate-900 truncate leading-tight">{e.title}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-rose-600">Rp {formatIDR(e.amount)}</p>
            </div>
            <button 
              onClick={() => onDelete(e.id)}
              className="p-1.5 text-slate-200 hover:text-rose-500"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )) : (
          <div className="text-center py-16 opacity-30">
            <Receipt size={32} strokeWidth={1} className="mx-auto mb-2" />
            <p className="text-[9px] font-black uppercase tracking-widest">Belum ada catatan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseView;
