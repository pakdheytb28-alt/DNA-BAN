
import React, { useState } from 'react';
import { Search, Plus, PackageOpen, ArrowUpRight, Edit2, Trash2, SlidersHorizontal, Info } from 'lucide-react';
import { TireItem } from '../types';

interface InventoryListProps {
  tires: TireItem[];
  onAddNew: () => void;
  onQuickOut?: (id: string) => void;
  onEdit?: (tire: TireItem) => void;
  onDelete?: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ tires, onAddNew, onQuickOut, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTires = tires.filter(tire => 
    tire.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tire.size.includes(searchTerm)
  );

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-none">Katalog Ban</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{tires.length} Produk Terdaftar</p>
        </div>
        <button 
          onClick={onAddNew}
          className="bg-slate-900 text-white p-2.5 rounded-xl active:scale-90 transition-all shadow-md"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
        <input 
          type="text"
          placeholder="Cari merk atau ukuran..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-[12px] font-medium text-slate-900 outline-none focus:border-slate-300 shadow-sm"
        />
      </div>

      <div className="space-y-2 pb-10">
        {filteredTires.length > 0 ? filteredTires.map(tire => {
          const isLow = tire.stock <= tire.minStock;
          
          return (
            <div key={tire.id} className="bg-white p-3.5 rounded-xl border border-slate-50 shadow-sm flex items-center gap-3 group active:bg-slate-50">
              {/* Left Color Indicator */}
              <div className={`w-1 self-stretch rounded-full ${isLow ? 'bg-orange-500' : 'bg-slate-200'}`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{tire.brand}</span>
                  <span className="text-[8px] font-bold text-slate-300 uppercase">• {tire.type}</span>
                </div>
                <h3 className="text-[13px] font-extrabold text-slate-900 truncate leading-none">{tire.model}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{tire.size}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 mb-1">
                  <p className={`text-sm font-black ${isLow ? 'text-orange-600' : 'text-slate-900'}`}>{tire.stock}</p>
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Unit</span>
                </div>
                <p className="text-[11px] font-bold text-slate-900">Rp {formatIDR(tire.price)}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button 
                  onClick={() => onQuickOut?.(tire.id)}
                  className="p-2 bg-slate-900 text-white rounded-lg active:scale-90 transition-all"
                >
                  <ArrowUpRight size={14} />
                </button>
                <div className="flex flex-col gap-1">
                  <button onClick={() => onEdit?.(tire)} className="p-1.5 text-slate-300 hover:text-slate-900"><Edit2 size={12} /></button>
                  <button onClick={() => onDelete?.(tire.id)} className="p-1.5 text-slate-300 hover:text-rose-500"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <PackageOpen size={32} className="text-slate-200" />
            <p className="text-[9px] font-black text-slate-300 uppercase">Katalog Kosong</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
