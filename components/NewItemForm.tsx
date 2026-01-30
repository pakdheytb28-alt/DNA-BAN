
import React, { useState, useEffect } from 'react';
import { X, Check, Tag, Package, Ruler, Layers, Edit3, Percent, Calculator, MousePointer2, TrendingUp, Landmark } from 'lucide-react';
import { TireItem, TireType } from '../types';

interface NewItemFormProps {
  initialData?: TireItem;
  onSubmit: (newItem: TireItem) => void;
  onCancel: () => void;
}

const PRESET_BRANDS = ['IRC', 'Michelin', 'Pirelli', 'Dunlop', 'FDR', 'Aspira', 'Maxxis', 'Lainnya'];

export default function NewItemForm({ initialData, onSubmit, onCancel }: NewItemFormProps) {
  const [selectedBrand, setSelectedBrand] = useState(initialData?.brand || 'IRC');
  const [customBrand, setCustomBrand] = useState(initialData && !PRESET_BRANDS.includes(initialData.brand) ? initialData.brand : '');
  const [pricingMode, setPricingMode] = useState<'HET' | 'MARKUP'>(initialData?.het ? 'HET' : 'MARKUP');
  
  const [formData, setFormData] = useState<Omit<TireItem, 'id' | 'brand'>>({
    model: initialData?.model || '',
    size: initialData?.size || '',
    type: initialData?.type || 'Tubeless',
    stock: initialData?.stock || 0,
    minStock: initialData?.minStock || 5,
    purchasePrice: initialData?.purchasePrice || 0,
    het: initialData?.het || 0,
    discount: initialData?.discount || 0,
    shopDiscount: initialData?.shopDiscount || 0,
    margin: initialData?.margin || 15,
    price: initialData?.price || 0
  });

  useEffect(() => {
    if (pricingMode === 'HET') {
      const calculatedPurchase = formData.het - (formData.het * ((formData.shopDiscount || 0) / 100));
      const calculatedSale = formData.het - (formData.het * (formData.discount / 100));
      
      setFormData(prev => ({ 
        ...prev, 
        purchasePrice: Math.round(calculatedPurchase),
        price: Math.round(calculatedSale)
      }));
    } else {
      const calculatedSale = formData.purchasePrice + (formData.purchasePrice * ((formData.margin || 0) / 100));
      setFormData(prev => ({ 
        ...prev, 
        price: Math.round(calculatedSale) 
      }));
    }
  }, [formData.het, formData.discount, formData.shopDiscount, formData.purchasePrice, formData.margin, pricingMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrand = selectedBrand === 'Lainnya' ? customBrand : selectedBrand;
    
    if (!finalBrand || finalBrand.trim() === '') {
      alert("Harap tentukan merk ban");
      return;
    }
    if (!formData.model || !formData.size) {
      alert("Harap isi Model dan Ukuran ban");
      return;
    }
    
    onSubmit({
      ...formData,
      brand: finalBrand,
      id: initialData?.id || Date.now().toString()
    });
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-black text-slate-900">{initialData ? 'Edit Ban' : 'Produk Baru'}</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{initialData ? 'Ubah Data' : 'Tambah Master'}</p>
        </div>
        <button 
          onClick={onCancel} 
          className="p-1.5 bg-slate-100 text-slate-400 rounded-lg"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pb-10">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Merk</label>
            <div className="relative">
              <select 
                value={PRESET_BRANDS.includes(selectedBrand) ? selectedBrand : 'Lainnya'}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 appearance-none outline-none focus:border-slate-900 shadow-sm"
              >
                {PRESET_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <Layers size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Jenis</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as TireType})}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none focus:border-slate-900 shadow-sm"
            >
              <option value="Tubeless">Tubeless</option>
              <option value="Tube Type">Tube Type</option>
            </select>
          </div>
        </div>

        {(selectedBrand === 'Lainnya' || (initialData && !PRESET_BRANDS.includes(initialData.brand))) && (
          <div className="space-y-1 animate-in slide-in-from-top-1">
            <label className="text-[9px] font-black text-blue-600 uppercase ml-1">Merk Baru</label>
            <input 
              type="text"
              placeholder="Ketik merk..."
              value={customBrand}
              onChange={(e) => setCustomBrand(e.target.value)}
              className="w-full bg-blue-50/30 border border-blue-100 rounded-xl py-2.5 px-3 text-[12px] font-bold text-blue-900 outline-none focus:border-blue-400"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Model / Seri</label>
            <input 
              type="text"
              placeholder="Mis: Pilot Street"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none focus:border-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Ukuran</label>
            <input 
              type="text"
              placeholder="80/90-14"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl shadow-md space-y-4 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pricing Strategy</h3>
            <div className="flex bg-white/5 p-1 rounded-lg">
              <button 
                type="button"
                onClick={() => setPricingMode('HET')}
                className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${pricingMode === 'HET' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500'}`}
              >
                Metode HET
              </button>
              <button 
                type="button"
                onClick={() => setPricingMode('MARKUP')}
                className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all ${pricingMode === 'MARKUP' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500'}`}
              >
                Metode Margin
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {pricingMode === 'HET' ? (
              <div className="animate-in fade-in duration-300 space-y-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase ml-1">Harga HET</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">Rp</span>
                    <input 
                      type="number"
                      value={formData.het || ''}
                      onChange={(e) => setFormData({...formData, het: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/10 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs font-black text-white outline-none focus:border-emerald-500/50"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="text-[7px] font-bold text-slate-500 uppercase mb-1 block">Disc Toko (%)</label>
                    <input type="number" value={formData.shopDiscount || ''} onChange={(e) => setFormData({...formData, shopDiscount: parseFloat(e.target.value) || 0})} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-[11px] font-black text-emerald-400 outline-none" />
                  </div>
                  <div className="relative">
                    <label className="text-[7px] font-bold text-slate-500 uppercase mb-1 block">Disc Jual (%)</label>
                    <input type="number" value={formData.discount || ''} onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-[11px] font-black text-orange-400 outline-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300 space-y-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase ml-1">Harga Beli</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px]">Rp</span>
                    <input type="number" value={formData.purchasePrice || ''} onChange={(e) => setFormData({...formData, purchasePrice: parseInt(e.target.value) || 0})} className="w-full bg-white/10 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs font-black text-white outline-none focus:border-blue-500/50" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[8px] font-bold text-slate-400 uppercase ml-1">Margin (%)</label>
                   <input type="number" value={formData.margin || ''} onChange={(e) => setFormData({...formData, margin: parseFloat(e.target.value) || 0})} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-[11px] font-black text-blue-400 outline-none" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 text-center">
                <p className="text-[7px] font-black text-slate-500 uppercase mb-0.5">Modal</p>
                <p className="text-[11px] font-black text-white">Rp {formatIDR(formData.purchasePrice)}</p>
              </div>
              <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-center">
                <p className="text-[7px] font-black text-emerald-500 uppercase mb-0.5">Jual</p>
                <p className="text-[11px] font-black text-emerald-400">Rp {formatIDR(formData.price)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Stok Awal</label>
            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Limit Stok</label>
            <input type="number" value={formData.minStock} onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-[12px] font-bold text-slate-900 outline-none" />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 rounded-xl">Batal</button>
          <button type="submit" className="flex-[2] py-3 text-[10px] font-black uppercase tracking-wider text-white bg-slate-900 rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Check size={14} strokeWidth={3} /> {initialData ? 'Simpan Perubahan' : 'Daftarkan Ban'}
          </button>
        </div>
      </form>
    </div>
  );
}
