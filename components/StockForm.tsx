
import React, { useState, useEffect } from 'react';
import { X, Check, Search, AlertCircle, Minus, Plus, Banknote, Calculator, RotateCcw, Info, TrendingUp, Percent, ArrowRightLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TireItem } from '../types';

interface StockFormProps {
  type: 'IN' | 'OUT';
  tires: TireItem[];
  initialItemId?: string;
  onSubmit: (type: 'IN' | 'OUT', itemId: string, quantity: number, note?: string, customPrice?: number) => void;
  onCancel: () => void;
}

const StockForm: React.FC<StockFormProps> = ({ type, tires, initialItemId, onSubmit, onCancel }) => {
  const [selectedItemId, setSelectedItemId] = useState(initialItemId || '');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');
  const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
  
  const [percentMode, setPercentMode] = useState<'DISCOUNT_HET' | 'PROFIT_MODAL'>('DISCOUNT_HET');
  const [percentValue, setPercentValue] = useState<number>(0);

  const selectedTire = tires.find(t => t.id === selectedItemId);

  useEffect(() => {
    if (initialItemId) {
      setSelectedItemId(initialItemId);
    }
  }, [initialItemId]);

  useEffect(() => {
    if (selectedTire) {
      if (type === 'OUT') {
        const defaultDisc = selectedTire.discount || 0;
        setPercentValue(defaultDisc);
        setPercentMode('DISCOUNT_HET');
        const calculatedPrice = selectedTire.het - (selectedTire.het * (defaultDisc / 100));
        setCustomPrice(Math.round(calculatedPrice));
      } else {
        setCustomPrice(selectedTire.purchasePrice);
      }
    }
  }, [selectedItemId, type, selectedTire]);

  useEffect(() => {
    if (type === 'OUT' && selectedTire) {
      if (percentMode === 'DISCOUNT_HET') {
        const newPrice = selectedTire.het - (selectedTire.het * (percentValue / 100));
        setCustomPrice(Math.round(newPrice));
      } else {
        const newPrice = selectedTire.purchasePrice + (selectedTire.purchasePrice * (percentValue / 100));
        setCustomPrice(Math.round(newPrice));
      }
    }
  }, [percentValue, percentMode, selectedTire, type]);

  const filteredTires = tires.filter(t => 
    t.brand.toLowerCase().includes(search.toLowerCase()) || 
    t.model.toLowerCase().includes(search.toLowerCase()) ||
    t.size.includes(search)
  );

  const handleResetPrice = () => {
    if (selectedTire) {
      if (type === 'OUT') {
        setPercentValue(selectedTire.discount || 0);
        setPercentMode('DISCOUNT_HET');
      } else {
        setCustomPrice(selectedTire.purchasePrice);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    if (type === 'OUT' && selectedTire && selectedTire.stock < quantity) return;
    onSubmit(type, selectedItemId, quantity, note, customPrice);
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  const totalPrice = (customPrice || 0) * quantity;
  const totalMargin = selectedTire && customPrice ? (customPrice - selectedTire.purchasePrice) * quantity : 0;

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${type === 'IN' ? 'bg-blue-600' : 'bg-emerald-600'} text-white shadow-md`}>
            {type === 'IN' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-none">Stok {type === 'IN' ? 'Masuk' : 'Keluar'}</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Input Transaksi</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 pb-20">
        <section className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-2 bg-slate-300 rounded-full" />
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pilih Produk</h3>
          </div>
          
          {!selectedItemId ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text"
                  placeholder="Cari merk atau ukuran..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-[12px] font-bold text-slate-900 outline-none focus:border-slate-300 shadow-sm"
                />
              </div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-md divide-y divide-slate-50">
                {filteredTires.length > 0 ? filteredTires.map(t => (
                  <button key={t.id} type="button" onClick={() => setSelectedItemId(t.id)} className="w-full p-3 text-left flex justify-between items-center hover:bg-slate-50 active:bg-slate-100 transition-colors">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 truncate">{t.brand} {t.model}</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{t.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-slate-900">{t.stock}</p>
                      <p className="text-[7px] text-slate-400 font-bold uppercase">Stok</p>
                    </div>
                  </button>
                )) : <div className="p-6 text-center text-slate-400 text-[9px] font-bold uppercase">Tidak ditemukan</div>}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-6 -mt-6 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
              <div className="min-w-0 relative z-10">
                <div className="flex items-center gap-2 mb-0.5">
                   <span className="text-[8px] font-black px-1.5 py-0.5 bg-white/10 rounded uppercase">{selectedTire?.brand}</span>
                   <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Terpilih</span>
                </div>
                <p className="text-sm font-black truncate text-white">{selectedTire?.model}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{selectedTire?.size} • Stok: {selectedTire?.stock}</p>
              </div>
              <button type="button" onClick={() => setSelectedItemId('')} className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all relative z-10">
                <X size={16} />
              </button>
            </div>
          )}
        </section>

        {selectedTire && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-2 bg-slate-300 rounded-full" />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga & Penjualan</h3>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
              {type === 'OUT' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">HET</p>
                      <p className="text-[11px] font-black text-slate-900">Rp {formatIDR(selectedTire.het)}</p>
                    </div>
                    <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/50">
                      <p className="text-[8px] font-bold text-blue-500 uppercase mb-0.5">Modal</p>
                      <p className="text-[11px] font-black text-slate-900">Rp {formatIDR(selectedTire.purchasePrice)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">Kalkulator Harga</span>
                      <button 
                        type="button" 
                        onClick={() => setPercentMode(percentMode === 'DISCOUNT_HET' ? 'PROFIT_MODAL' : 'DISCOUNT_HET')}
                        className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[8px] font-black text-slate-300 uppercase"
                      >
                        <ArrowRightLeft size={8} /> {percentMode === 'DISCOUNT_HET' ? 'Diskon HET' : 'Laba Modal'}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="number"
                        value={percentValue || ''}
                        onChange={(e) => setPercentValue(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 pr-10 text-md font-black text-white focus:border-emerald-500 outline-none"
                        placeholder="0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-black text-sm">%</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[9px] font-bold text-slate-900 uppercase">Harga Jual Akhir</label>
                      <button type="button" onClick={handleResetPrice} className="text-[8px] font-black text-blue-600 uppercase">Reset</button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-xs">Rp</span>
                      <input 
                        type="number"
                        value={customPrice || ''}
                        onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-white border-2 border-emerald-50 rounded-xl py-3 pl-10 pr-4 text-lg font-black text-emerald-600 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-900 uppercase ml-1">Harga Kulakan</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500 font-black text-xs">Rp</span>
                    <input 
                      type="number"
                      value={customPrice || ''}
                      onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border-2 border-blue-50 rounded-xl py-3 pl-10 pr-4 text-lg font-black text-blue-600 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {selectedTire && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <div className="w-1 h-2 bg-slate-300 rounded-full" />
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jumlah Unit</h3>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-900 rounded-lg active:scale-90 transition-all">
                  <Minus size={20} />
                </button>
                <div className="flex-1 text-center">
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full text-center text-3xl font-black text-slate-900 bg-transparent outline-none"
                  />
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Unit</p>
                </div>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-900 rounded-lg active:scale-90 transition-all">
                  <Plus size={20} />
                </button>
              </div>

              {type === 'OUT' && quantity > selectedTire.stock && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-lg flex items-center gap-2 border border-rose-100 animate-pulse">
                  <AlertCircle size={14} />
                  <p className="text-[9px] font-black uppercase">Stok Tidak Cukup!</p>
                </div>
              )}

              <div className={`p-4 rounded-xl flex justify-between items-center ${type === 'OUT' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white shadow-md'}`}>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-80">Total Bayar</p>
                  <p className="text-[14px] font-black">Rp {formatIDR(totalPrice)}</p>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Calculator size={20} />
                </div>
              </div>
              
              {type === 'OUT' && totalMargin !== 0 && (
                <div className={`flex justify-between items-center px-4 py-2 rounded-lg border-2 text-[10px] font-bold uppercase transition-all ${totalMargin > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                   <span>Estimasi {totalMargin > 0 ? 'Laba' : 'Rugi'}</span>
                   <span>Rp {formatIDR(Math.abs(totalMargin))}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {selectedTire && (
          <section className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-4">
              <input 
                type="text"
                placeholder="Catatan tambahan..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-3 px-4 text-[12px] font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-300 placeholder:text-slate-300"
              />

              <button 
                disabled={!selectedItemId || quantity <= 0 || (type === 'OUT' && quantity > selectedTire.stock)}
                className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none ${
                  type === 'IN' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}
              >
                <Check size={18} strokeWidth={3} />
                Simpan Transaksi
              </button>
            </div>
          </section>
        )}
      </form>
    </div>
  );
};

export default StockForm;
