
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BrainCircuit, RefreshCw } from 'lucide-react';
import { getInventoryInsights } from '../services/geminiService';
import { TireItem, Transaction } from '../types';

interface AiInsightsProps {
  tires: TireItem[];
  transactions: Transaction[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ tires, transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getInventoryInsights(tires, transactions);
    setInsight(result || "Gagal mendapatkan analisis.");
    setLoading(false);
  };

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-3 space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-purple-600" />
          <h2 className="text-lg font-bold text-slate-800">Smart Analysis</h2>
        </div>
        <button 
          onClick={fetchInsight}
          disabled={loading}
          className="p-1 text-slate-400 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 text-purple-400 opacity-20" size={32} />
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-purple-300">Live Prediction</h3>
        </div>
        
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 min-h-[100px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={24} />
              <p className="text-[9px] font-black uppercase tracking-tighter">Gemini Thinking...</p>
            </div>
          ) : (
            <div className="text-[11px] leading-relaxed text-slate-200">
              {insight?.split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-2">
        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Info Sistem</h4>
        <div className="space-y-1.5">
          {[
            "Analisis berdasarkan data 20 transaksi terakhir.",
            "Prediksi tren menggunakan engine Gemini Flash."
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
              <p className="text-[10px] text-slate-500 font-medium">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
