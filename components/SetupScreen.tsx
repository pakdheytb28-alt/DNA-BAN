
import React, { useState } from 'react';
import { Database, ShieldCheck, HardDrive, CheckCircle2, Loader2, Sparkles, Package } from 'lucide-react';

interface SetupScreenProps {
  onComplete: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [step, setStep] = useState(0);

  const startSetup = () => {
    setIsCreating(true);
    
    // Simulasi proses pembuatan "tabel" database
    setTimeout(() => setStep(1), 800);
    setTimeout(() => setStep(2), 1600);
    setTimeout(() => setStep(3), 2400);
    setTimeout(() => {
      onComplete();
    }, 3200);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-900 text-white p-8 justify-center items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl animate-bounce duration-[2000ms]">
          <Package size={40} className="text-emerald-400" />
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight mb-2">D&A BAN</h1>
          <p className="text-slate-400 text-sm font-medium">Sistem Manajemen Toko Ban Offline</p>
        </div>

        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex items-start gap-4 text-left">
            <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0">
              <ShieldCheck size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white uppercase">Penyimpanan Aman</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Seluruh data stok dan keuangan tersimpan 100% secara lokal di memori HP Anda. Tidak butuh internet.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
              <HardDrive size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white uppercase">Inisialisasi Database</p>
              <p className="text-[10px] text-slate-400 mt-1">Sistem butuh membuat ruang database baru di memori perangkat sebelum digunakan.</p>
            </div>
          </div>
        </div>

        {isCreating ? (
          <div className="w-full space-y-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-emerald-400" size={32} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 animate-pulse">
                {step === 0 && "Menghubungi Memori Lokal..."}
                {step === 1 && "Membangun Tabel Database..."}
                {step === 2 && "Menyiapkan Kunci Enkripsi..."}
                {step === 3 && "Hampir Selesai..."}
              </p>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
                  style={{ width: `${(step + 1) * 25}%` }} 
               />
            </div>
          </div>
        ) : (
          <button 
            onClick={startSetup}
            className="w-full group relative overflow-hidden bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Database size={16} />
              Buat Database Lokal
            </span>
            <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
          </button>
        )}

        <div className="flex items-center gap-2 pt-4">
           <Sparkles size={12} className="text-yellow-400" />
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Powered by Offline-First Technology</p>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;