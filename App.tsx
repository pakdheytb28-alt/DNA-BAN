
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  History, 
  Settings as SettingsIcon,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
  Receipt,
  Plus
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import StockForm from './components/StockForm';
import TransactionHistory from './components/TransactionHistory';
import Settings from './components/Settings';
import NewItemForm from './components/NewItemForm';
import ReportView from './components/ReportView';
import ExpenseView from './components/ExpenseView';
import SetupScreen from './components/SetupScreen';
import { TireItem, Transaction, ViewState, Expense } from './types';

const App: React.FC = () => {
  // REF: Gunakan ref untuk memblokir penulisan storage secara instan (Sinkron)
  // Ini kunci utama agar data tidak 'nulis balik' saat dihapus
  const blockSaveRef = useRef(false);

  const [isInitialized, setIsInitialized] = useState<boolean>(() => {
    return localStorage.getItem('banstock_initialized') === 'true';
  });
  
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [preSelectedItemId, setPreSelectedItemId] = useState<string | undefined>(undefined);
  const [editingTire, setEditingTire] = useState<TireItem | undefined>(undefined);
  
  const [tires, setTires] = useState<TireItem[]>(() => {
    const saved = localStorage.getItem('banstock_tires');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('banstock_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('banstock_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Sinkronisasi data ke Local Storage HP dengan proteksi BlockSave
  useEffect(() => {
    if (isInitialized && !blockSaveRef.current) {
      localStorage.setItem('banstock_tires', JSON.stringify(tires));
    }
  }, [tires, isInitialized]);

  useEffect(() => {
    if (isInitialized && !blockSaveRef.current) {
      localStorage.setItem('banstock_transactions', JSON.stringify(transactions));
    }
  }, [transactions, isInitialized]);

  useEffect(() => {
    if (isInitialized && !blockSaveRef.current) {
      localStorage.setItem('banstock_expenses', JSON.stringify(expenses));
    }
  }, [expenses, isInitialized]);

  const handleInitialize = () => {
    localStorage.setItem('banstock_initialized', 'true');
    localStorage.setItem('banstock_tires', '[]');
    localStorage.setItem('banstock_transactions', '[]');
    localStorage.setItem('banstock_expenses', '[]');
    setIsInitialized(true);
  };

  const handleAddTransaction = (type: 'IN' | 'OUT', itemId: string, quantity: number, note?: string, customPrice?: number) => {
    const tire = tires.find(t => t.id === itemId);
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      itemId,
      type,
      quantity,
      date: new Date().toISOString(),
      note,
      priceAtTransaction: customPrice !== undefined ? customPrice : (tire?.price || 0)
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setTires(prev => prev.map(t => {
      if (t.id === itemId) {
        return {
          ...t,
          stock: type === 'IN' ? t.stock + quantity : t.stock - quantity
        };
      }
      return t;
    }));
    setPreSelectedItemId(undefined);
    setView('DASHBOARD');
  };

  const handleAddNewTire = (newItem: TireItem) => {
    setTires(prev => [...prev, newItem]);
    setView('INVENTORY');
  };

  const handleUpdateTire = (updatedItem: TireItem) => {
    setTires(prev => prev.map(t => t.id === updatedItem.id ? updatedItem : t));
    setEditingTire(undefined);
    setView('INVENTORY');
  };

  const handleDeleteTire = (id: string) => {
    if (window.confirm("Hapus produk ini dari katalog?")) {
      setTires(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleEditClick = (tire: TireItem) => {
    setEditingTire(tire);
    setView('EDIT_ITEM');
  };

  const handleQuickAction = (type: 'IN' | 'OUT', itemId?: string) => {
    setPreSelectedItemId(itemId);
    setView(type === 'IN' ? 'STOCK_IN' : 'STOCK_OUT');
    setShowActionMenu(false);
  };

  const handleExportData = () => {
    const data = {
      tires,
      transactions,
      expenses,
      exportDate: new Date().toISOString(),
      appName: 'BanStock'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `banstock_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.tires && json.transactions && json.expenses) {
          if (window.confirm("Restore data akan menimpa data saat ini. Lanjutkan?")) {
            setTires(json.tires);
            setTransactions(json.transactions);
            setExpenses(json.expenses);
            alert("Data berhasil dipulihkan!");
          }
        } else {
          alert("Format file tidak valid.");
        }
      } catch (err) {
        alert("Gagal membaca file backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetAllData = () => {
    const confirmMessage = "PERINGATAN KERAS!\n\nSeluruh data akan dihapus permanen dari memori HP.\n\nApakah Anda benar-benar yakin?";
    
    if (window.confirm(confirmMessage)) {
      // 1. Blokir semua fungsi SAVE ke localStorage secara instan (SINKRON)
      blockSaveRef.current = true;
      
      // 2. Hapus data secara manual dan spesifik
      localStorage.removeItem('banstock_initialized');
      localStorage.removeItem('banstock_tires');
      localStorage.removeItem('banstock_transactions');
      localStorage.removeItem('banstock_expenses');
      
      // 3. Cadangan: Bersihkan total storage (Clear All)
      localStorage.clear();

      // 4. Ubah state memori agar UI segera kosong (jika belum reload)
      setTires([]);
      setTransactions([]);
      setExpenses([]);
      setIsInitialized(false);
      
      // 5. Paksa reload total halaman agar kembali ke layar Setup
      alert("Database telah dikosongkan.");
      window.location.reload();
    }
  };

  if (!isInitialized) {
    return <SetupScreen onComplete={handleInitialize} />;
  }

  const lowStockCount = tires.filter(t => t.stock <= t.minStock).length;

  const renderView = () => {
    switch (view) {
      case 'DASHBOARD':
        return <Dashboard tires={tires} transactions={transactions} expenses={expenses} onNavigate={setView} />;
      case 'INVENTORY':
        return (
          <InventoryList 
            tires={tires} 
            onAddNew={() => setView('NEW_ITEM')} 
            onQuickOut={(id) => handleQuickAction('OUT', id)} 
            onEdit={handleEditClick}
            onDelete={handleDeleteTire}
          />
        );
      case 'STOCK_IN':
        return <StockForm type="IN" tires={tires} initialItemId={preSelectedItemId} onSubmit={handleAddTransaction} onCancel={() => setView('DASHBOARD')} />;
      case 'STOCK_OUT':
        return <StockForm type="OUT" tires={tires} initialItemId={preSelectedItemId} onSubmit={handleAddTransaction} onCancel={() => setView('DASHBOARD')} />;
      case 'HISTORY':
        return <TransactionHistory transactions={transactions} tires={tires} />;
      case 'REPORTS':
        return <ReportView transactions={transactions} expenses={expenses} tires={tires} />;
      case 'EXPENSES':
        return <ExpenseView expenses={expenses} onAdd={(e) => setExpenses(prev => [e, ...prev])} onDelete={(id) => setExpenses(prev => prev.filter(x => x.id !== id))} />;
      case 'SETTINGS':
        return <Settings 
          onReset={handleResetAllData} 
          onExport={handleExportData} 
          onImport={handleImportData} 
          tiresCount={tires.length} 
          txCount={transactions.length} 
        />;
      case 'NEW_ITEM':
        return <NewItemForm onSubmit={handleAddNewTire} onCancel={() => setView('INVENTORY')} />;
      case 'EDIT_ITEM':
        return <NewItemForm initialData={editingTire} onSubmit={handleUpdateTire} onCancel={() => {setEditingTire(undefined); setView('INVENTORY');}} />;
      default:
        return <Dashboard tires={tires} transactions={transactions} expenses={expenses} onNavigate={setView} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden border-x border-slate-100">
      {showActionMenu && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40 transition-all duration-300" onClick={() => setShowActionMenu(false)} />}
      
      <header className="bg-white px-4 py-3 flex justify-between items-center shrink-0 z-20 border-b border-slate-50">
        <div className="flex items-center gap-2.5" onClick={() => setView('DASHBOARD')}>
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-md"><Package size={18} /></div>
          <div>
            <h1 className="text-md font-black text-slate-900 leading-none">MotorField</h1>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Ban & Inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <div className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded flex items-center gap-1 border border-orange-100">
              <AlertTriangle size={10} strokeWidth={3} />
              <span className="text-[9px] font-black">{lowStockCount}</span>
            </div>
          )}
          <button onClick={() => {setView('SETTINGS'); setShowActionMenu(false);}} className={`p-2 rounded-lg transition-all ${view === 'SETTINGS' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><SettingsIcon size={18} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#FCFCFD] pb-24">{renderView()}</main>

      <nav className="fixed bottom-0 w-full max-w-md glass-nav border-t border-slate-100 flex justify-around items-center pt-2 pb-6 px-1 z-50">
        <NavButton active={view === 'DASHBOARD'} onClick={() => {setView('DASHBOARD'); setShowActionMenu(false);}} icon={<LayoutDashboard size={20} />} label="Home" />
        <NavButton active={view === 'INVENTORY'} onClick={() => {setView('INVENTORY'); setShowActionMenu(false);}} icon={<Package size={20} />} label="Stok" />
        
        <div className="relative -top-5">
          {showActionMenu && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-40 animate-in slide-in-from-bottom-2 duration-300">
              <button onClick={() => handleQuickAction('IN')} className="w-full bg-white border border-slate-100 text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between group active:scale-95 transition-all">
                <span className="text-[10px] font-bold uppercase">Masuk</span>
                <ArrowDownLeft size={14} className="text-blue-500" />
              </button>
              <button onClick={() => handleQuickAction('OUT')} className="w-full bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between group active:scale-95 transition-all">
                <span className="text-[10px] font-bold uppercase">Jual</span>
                <ArrowUpRight size={14} className="text-emerald-400" />
              </button>
              <button onClick={() => {setView('EXPENSES'); setShowActionMenu(false);}} className="w-full bg-white border border-slate-100 text-slate-900 px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between group active:scale-95 transition-all">
                <span className="text-[10px] font-bold uppercase">Biaya</span>
                <Receipt size={14} className="text-rose-500" />
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowActionMenu(!showActionMenu)} 
            className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 border-[4px] border-[#FCFCFD] z-50 ${showActionMenu ? 'bg-rose-500 rotate-45 text-white' : 'bg-slate-900 text-white'}`}
          >
            {showActionMenu ? <Plus size={24} /> : <PlusCircle size={24} />}
          </button>
        </div>

        <NavButton active={view === 'REPORTS'} onClick={() => {setView('REPORTS'); setShowActionMenu(false);}} icon={<PieChart size={20} />} label="Laporan" />
        <NavButton active={view === 'HISTORY'} onClick={() => {setView('HISTORY'); setShowActionMenu(false);}} icon={<History size={20} />} label="Log" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center min-w-[56px] transition-all ${active ? 'text-slate-900' : 'text-slate-300'}`}>
    {icon}
    <span className={`text-[8px] mt-1 font-bold uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;
