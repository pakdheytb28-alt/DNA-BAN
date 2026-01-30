
import React, { useRef } from 'react';
import { Trash2, Info, Download, Upload, ShieldCheck, ChevronRight, HardDrive, FileJson, CheckCircle2, Database, MapPin, Lock } from 'lucide-react';

interface SettingsProps {
  onReset: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tiresCount: number;
  txCount: number;
}

const Settings: React.FC<SettingsProps> = ({ onReset, onExport, onImport, tiresCount, txCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 space-y-5 animate-in fade-in duration-500">
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-none">Pengaturan</h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Database & Sistem</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Sistem Aktif</span>
        </div>
      </div>

      {/* Tidy Database Summary with Sync Indicator */}
      <div className="bg-slate-900 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 text-white p-2.5 rounded-xl border border-white/5">
              <HardDrive size={20} />
            </div>
            <div>
              <h3 className="text-[12px] font-black text-white">Data Perangkat</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={10} className="text-emerald-400" />
                <p className="text-[8px] text-emerald-400 uppercase font-black tracking-widest">Tersinkron Lokal</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
             <ShieldCheck size={10} />
             <span className="text-[7px] font-black uppercase">Encrypted</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl backdrop-blur-sm">
            <p className="text-[7px] text-slate-500 font-black uppercase mb-1 tracking-wider">Master Produk</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-black text-white">{tiresCount}</p>
              <span className="text-[8px] text-slate-500 font-bold">SKU</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 p-3.5 rounded-2xl backdrop-blur-sm">
            <p className="text-[7px] text-slate-500 font-black uppercase mb-1 tracking-wider">Log Transaksi</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-black text-white">{txCount}</p>
              <span className="text-[8px] text-slate-500 font-bold">TX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Technical Information Section */}
      <div className="space-y-1.5">
        <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1">Informasi Lokasi Database</h4>
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
              <Database size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Tipe Database</p>
              <p className="text-[9px] text-slate-500 font-medium">Browser-Persistent LocalStorage (JSON)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Lokasi Fisik Data</p>
              <p className="text-[9px] text-slate-500 font-mono leading-tight">
                /data/user/0/com.browser/app_webview/Default/Local Storage
              </p>
              <p className="text-[8px] text-emerald-600 font-bold mt-1 uppercase italic">*Data tersimpan di memori internal HP Anda</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
              <Lock size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Keamanan & Privasi</p>
              <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                Data tidak dikirim ke server luar (Cloud). Keamanan database mengikuti sistem enkripsi file sandboxing browser Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1">Kontrol Data</h4>
        
        <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden shadow-sm">
          <button onClick={onExport} className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl"><Download size={18} /></div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900">Backup Data</p>
                <p className="text-[8px] text-slate-400 font-medium">Ekspor ke file .json</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 flex items-center justify-between active:bg-slate-50 transition-all group">
            <input type="file" ref={fileInputRef} onChange={onImport} accept=".json" className="hidden" />
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl"><Upload size={18} /></div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900">Restore Data</p>
                <p className="text-[8px] text-slate-400 font-medium">Impor dari file cadangan</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>

          <button onClick={onReset} className="w-full p-4 flex items-center justify-between active:bg-rose-50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="bg-rose-50 text-rose-500 p-2.5 rounded-xl"><Trash2 size={18} /></div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900 text-rose-600">Kosongkan Data</p>
                <p className="text-[8px] text-slate-400 font-medium text-rose-400/70">Hapus permanen database</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1">Info Aplikasi</h4>
        <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-50 shadow-sm overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="bg-green-50 text-green-600 p-2.5 rounded-xl"><ShieldCheck size={18} /></div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Keamanan Data</p>
              <p className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter italic">Penyimpanan Offline Lokal</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="bg-slate-50 text-slate-400 p-2.5 rounded-xl"><Info size={18} /></div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Versi</p>
              <p className="text-[8px] text-slate-400 font-medium">v2.1.5-ProSync</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4 text-center">
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.2em]">MotorField Inventory © 2025</p>
      </div>
    </div>
  );
};

export default Settings;
