import React, { useState } from 'react';
import {
  Product,
  Order,
  Category,
  LogEntry,
  AutoReplyRule,
  WhatsAppContact,
  BankSettings,
} from '../types';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  PlusCircle,
  Trash2,
  Percent,
  MessageSquare,
  Phone,
  Tag,
  ShoppingBag,
  Clock,
  Coins,
  Settings,
  Plus,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  t: any;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  addLog: (action: string, msg: string) => void;
  autoReplyEnabled: boolean;
  setAutoReplyEnabled: (v: boolean) => void;
  autoReplies: AutoReplyRule[];
  setAutoReplies: React.Dispatch<React.SetStateAction<AutoReplyRule[]>>;
  autoReplyFallback: string;
  setAutoReplyFallback: (v: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (v: string) => void;
  whatsappContacts: WhatsAppContact[];
  setWhatsappContacts: React.Dispatch<React.SetStateAction<WhatsAppContact[]>>;
  bankSettings: BankSettings;
  setBankSettings: React.Dispatch<React.SetStateAction<BankSettings>>;
  onResetDb: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  lang,
  t,
  products,
  setProducts,
  categories,
  setCategories,
  orders,
  setOrders,
  logs,
  setLogs,
  addLog,
  autoReplyEnabled,
  setAutoReplyEnabled,
  autoReplies,
  setAutoReplies,
  autoReplyFallback,
  setAutoReplyFallback,
  whatsappNumber,
  setWhatsappNumber,
  whatsappContacts,
  setWhatsappContacts,
  bankSettings,
  setBankSettings,
  onResetDb,
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [logoSrc, setLogoSrc] = useState('/logo.jpg');
  const [loginError, setLoginError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('qeb_pass_v2') || '1993');

  const [activeTab, setActiveTab] = useState('orders'); // orders, products, discounts, chat, whatsapp

  // Add Product Form Local Error states
  const [prodTitleAz, setProdTitleAz] = useState('');
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodTitleRu, setProdTitleRu] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('10');
  const [prodCat, setProdCat] = useState('geyim');
  const [prodImage, setProdImage] = useState('');
  const [prodSize, setProdSize] = useState('');
  const [prodDiscount, setProdDiscount] = useState('0');

  // Add Category form states
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('📁');

  // Add keyword rule forms
  const [newKeyword, setNewKeyword] = useState('');
  const [newReply, setNewReply] = useState('');

  // Password update form states
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Bulk discount form rates
  const [bulkCatId, setBulkCatId] = useState('geyim');
  const [bulkCatPct, setBulkCatPct] = useState('');
  const [bulkAllPct, setBulkAllPct] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = () => {
    setLoginError('');
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      setPasswordInput('');
      addLog('admin_login', 'İdarəçi panelinə uğurlu giriş edildi.');
    } else {
      setLoginError(t.adminWrongPassword || 'Səhv şifrə!');
    }
  };

  const getFormattedWhatsAppNumber = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('994')) {
      return `+994 (${clean.slice(3, 5)}) ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
    }
    return `+${clean}`;
  };

  const formattedWhatsApp = getFormattedWhatsAppNumber(whatsappNumber);

  // CALCULATED ADMİSTATS
  const completedOrders = orders.filter(o => o.status === 'tamamlandi');
  const totalCompletedEarnings = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const outOfStockCount = products.filter(p => !p.stock || p.stock <= 0).length;

  return (
    <div
      id="admin-panel"
      className={
        isAuthenticated
          ? 'fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col overflow-hidden w-screen h-screen'
          : 'fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-md p-2 md:p-6 flex items-center justify-center border border-neutral-800'
      }
    >
      {!isAuthenticated ? (
        /* LOCK GATEWAY CARD */
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-t-8 border-emerald-805 relative space-y-4">
          <button
            onClick={() => {
              onClose();
              setPasswordInput('');
              setLoginError('');
            }}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-705 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center pb-2 border-b border-neutral-100 flex flex-col items-center">
            <div className="bg-red-50 h-12 w-12 rounded-2xl flex items-center justify-center text-red-650 mx-auto mb-2 shadow-sm border border-red-100">
              <Lock className="w-6 h-6 text-emerald-850" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 font-display">
              {t.adminTitle || 'İdarəçi Girişi'}
            </h3>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Sistemə daxil olmaq üçün şifrənizi qeyd edin
            </p>
          </div>

          <div className="space-y-4 text-left">
            {loginError && (
              <div className="p-2.5 border border-red-200 bg-red-50 text-red-650 text-xs font-bold rounded-xl text-center leading-relaxed">
                {loginError}
              </div>
            )}

            <div className="space-y-1 text-xs font-bold text-neutral-700">
              <label>{t.adminPasswordLabel || 'Giriş Şifrəsi:'}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={t.adminPasswordPlaceholder || 'Daxil edin...'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoginSubmit();
                  }}
                  className="w-full border rounded-xl pl-3 pr-10 py-3 bg-neutral-50/50 focus:bg-white outline-none focus:border-red-500 font-medium font-mono text-sm tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-450 hover:text-neutral-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2 text-xs font-black">
              <button
                onClick={() => {
                  onClose();
                  setPasswordInput('');
                  setLoginError('');
                }}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-all cursor-pointer"
              >
                {t.cancelBtn || 'İmtina Et'}
              </button>
              <button
                onClick={handleLoginSubmit}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl transition-all shadow-md cursor-pointer"
              >
                {t.adminLoginBtn || 'Giriş Et'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DYNAMIC PANEL FULLSCREEN WRAPPER */
        <div className="w-full h-full bg-[#FAF9F5] flex flex-col overflow-hidden text-neutral-80s">
          {/* Header row */}
          <div className="bg-neutral-900 text-white px-6 py-4 flex justify-between items-center border-b-4 border-emerald-800">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 rounded bg-white p-0.5 overflow-hidden border border-white/20 select-none">
                <img
                  src={logoSrc}
                  alt="Logo"
                  onError={() => {
                    if (logoSrc === '/logo.jpg') {
                      setLogoSrc('/logo.png');
                    } else if (logoSrc === '/logo.png') {
                      setLogoSrc('/logo.svg');
                    } else if (logoSrc !== 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format') {
                      setLogoSrc('https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format');
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-black font-display font-black tracking-tight flex items-center gap-1">
                  <span>{t.adminDashboardTitle || 'Müdir İdarəetmə Paneli'}</span>
                </h4>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#BAD3C7]">
                  SECURE INTERNAL CRM SYSTEM
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-black text-[10px]">
              <button
                onClick={() => {
                  if (confirm(t.resetDbConfirm || 'Məlumat bazası sıfırlansın? All orders and custom inventories will reset.')) {
                    onResetDb();
                  }
                }}
                className="px-3 py-1.5 border border-neutral-700 hover:border-red-650 text-neutral-450 rounded-lg hover:text-red-500 hover:bg-white/5 transition-all cursor-pointer"
              >
                {t.resetDbBtn || 'Məlumatları Sıfırla'}
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  onClose();
                  setPasswordInput('');
                  setLoginError('');
                }}
                className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logoutBtn || 'Çıxış'}</span>
              </button>
            </div>
          </div>

          {/* KPI Statistics Dashboard Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#FAF9F5]/75 border-b border-red-100">
            <div className="bg-white p-3 border border-red-150 rounded-2xl text-left">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">CƏMİ SATIŞ</span>
              <p className="text-xl font-black font-mono text-emerald-800 mt-1">
                {totalCompletedEarnings.toFixed(2)} ₼
              </p>
            </div>
            <div className="bg-white p-3 border border-red-150 rounded-2xl text-left">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">SİFARİŞLƏR</span>
              <p className="text-xl font-black font-mono text-neutral-900 mt-1">{orders.length} ədəd</p>
            </div>
            <div className="bg-white p-3 border border-red-150 rounded-2xl text-left">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">TÜKƏNƏNLƏR</span>
              <p className="text-xl font-black text-red-600 mt-1">{outOfStockCount} geyim/aksesuar</p>
            </div>
            <div className="bg-white p-3 border border-red-150 rounded-2xl text-left">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">KART BALANSI</span>
              <p className="text-xl font-black text-emerald-600 font-mono mt-1">{bankSettings.balance.toFixed(2)} ₼</p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="bg-white border-b border-red-100 px-6 py-2.5 flex flex-wrap gap-2 shrink-0">
            {[
              { id: 'orders', label: '📥 Sifarişlər', count: orders.filter(o => o.status === 'yeni').length },
              { id: 'products', label: '📦 Məhsul & Kataloq' },
              { id: 'discounts', label: '💸 Kampaniya & Endirimlər' },
              { id: 'chat', label: '💬 Süni Bot & Daxili Çat' },
              { id: 'whatsapp', label: '📱 WhatsApp & Şifrə' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer relative ${
                  activeTab === tab.id
                    ? 'bg-neutral-950 text-white shadow-sm'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black ml-1.5 animate-pulse">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB DETAILED BLOCKS CONTAINER */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8 pb-12">
            
            {/* TAB: ORDERS PANEL */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-scale-up text-left">
                <h5 className="font-extrabold text-neutral-950 flex items-center space-x-2 text-sm uppercase font-display">
                  <ShoppingBag className="w-4 h-4 text-emerald-800" />
                  <span>{t.ordersTitle || 'Gələn Sifarişlər'} ({orders.length})</span>
                </h5>

                <div className="overflow-x-auto border border-red-100 bg-white rounded-3xl shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs text-neutral-700 divide-y divide-neutral-100 h-full">
                    <thead className="bg-[#FAF9F5] font-black text-[10px] uppercase text-neutral-500 border-b border-red-100">
                      <tr>
                        <th className="p-4">Kod</th>
                        <th className="p-4">Müştəri / Tel</th>
                        <th className="p-4">Ünvan / Ödəniş</th>
                        <th className="p-4">Toplam</th>
                        <th className="p-4 text-right">Durum & İşlər</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-neutral-400 font-extrabold">
                            Heç bir sifariş yoxdur.
                          </td>
                        </tr>
                      ) : (
                        orders.map(o => (
                          <tr key={o.id} className="hover:bg-red-50/20">
                            <td className="p-4 font-bold font-mono text-neutral-900">{o.id}</td>
                            <td className="p-4 text-left">
                              <p className="font-black text-neutral-900">{o.customerName}</p>
                              <p className="text-[10px] text-neutral-500 font-mono font-bold mt-0.5">
                                {o.phoneNumber}
                              </p>
                            </td>
                            <td className="p-4 text-left">
                              <p className="text-neutral-600 font-semibold max-w-[200px] truncate">
                                {o.address}
                              </p>
                              <span className="text-[9px] text-[#865F2B] font-black uppercase tracking-wider block mt-1">
                                {o.paymentMethod === 'cash' ? '💵 Qapıda Nəğd' : '💳 Kartla'}{' '}
                                {o.isPaid ? ' (ÖDƏNİLİB)' : ' (Yoxlanılır)'}
                              </span>
                            </td>
                            <td className="p-4 font-black font-mono text-neutral-950 text-[13px]">
                              {o.totalPrice.toFixed(2)} ₼
                            </td>
                            <td className="p-4 text-right flex items-center justify-end space-x-2 gap-1 relative">
                              <button
                                onClick={() => {
                                  const msgText = `Özünə dəyər verməyi bacaran insan! Sifarişiniz hazırlanır. Əmin olun ki, etdiyiniz bu sifariş sizə ən tez zamanda və güvənli bir şəkildə əlinizə çatacaq. Qeyd edək ki, məhsullarımızın geri qaytarılması yoxdur. Memi Qəbələ hər zaman sizin xidmətinizdədir. Əsl Avropa brendlərini Memi Qəbələ sizlər üçün yaxın etdi.`;
                                  const clean = o.phoneNumber.replace(/\D/g, '');
                                  const url = `https://wa.me/${clean}?text=${encodeURIComponent(msgText)}`;
                                  window.open(url, '_blank');
                                  addLog('wa_message_sent', `${o.customerName} adlı müştəriyə WhatsApp sifariş təbriki göndərildi.`);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-250 text-emerald-800 rounded-lg text-[9px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm border border-emerald-200"
                              >
                                <MessageSquare className="w-3 h-3 text-emerald-800" />
                                <span>WhatsApp Mesaj</span>
                              </button>

                              <select
                                value={o.status}
                                onChange={(e) => {
                                  const nextStatus = e.target.value;
                                  setOrders(prev =>
                                    prev.map(item => (item.id === o.id ? { ...item, status: nextStatus } : item))
                                  );
                                  addLog(
                                    'order_status_update',
                                    `${o.id} kodlu sifariş "${nextStatus}" statusuna çevrildi.`
                                  );
                                }}
                                className="border border-red-150 rounded-xl text-[10px] px-2.5 py-1.5 outline-none font-black bg-white focus:ring-1 focus:ring-emerald-800 cursor-pointer text-neutral-80s"
                              >
                                <option value="yeni">{t.statusYeni || 'Yeni Sifariş'}</option>
                                <option value="gozleyir">{t.statusGozleyir || 'Gözləmədə'}</option>
                                <option value="tamamlandi">{t.statusTamamlandi || 'Tamamlandı'}</option>
                                <option value="legv">{t.statusLegv || 'Ləğv edildi'}</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: INVENTORY CATALOG & ADD FORM */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-scale-up text-left">
                {/* Form layout */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm space-y-4">
                  <h5 className="font-extrabold text-neutral-950 text-sm flex items-center space-x-2 font-display">
                    <PlusCircle className="w-4 h-4 text-emerald-855" />
                    <span>{t.addProductTitle || 'Yeni Məhsul Əlavə Et'}</span>
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Adı (AZ)*</label>
                      <input
                        type="text"
                        placeholder="Məsələn: Avropa Gödəkçə..."
                        value={prodTitleAz}
                        onChange={(e) => setProdTitleAz(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Adı (EN)</label>
                      <input
                        type="text"
                        placeholder="European Vintage Jacket..."
                        value={prodTitleEn}
                        onChange={(e) => setProdTitleEn(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Adı (RU)</label>
                      <input
                        type="text"
                        placeholder="Европейская куртка..."
                        value={prodTitleRu}
                        onChange={(e) => setProdTitleRu(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-1 md:col-span-3">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Təsviri (AZ)</label>
                      <textarea
                        placeholder="Məhsul haqqında geniş məlumat..."
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500 resize-none h-16"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Qiyməti (₼)*</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Məsələn: 95.00"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Stok Sayı*</label>
                      <input
                        type="number"
                        placeholder="Stok..."
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Kateqoriyası</label>
                      <select
                        value={prodCat}
                        onChange={(e) => setProdCat(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-bold bg-white outline-none cursor-pointer"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.name_az}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1 md:col-span-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Şəkil URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Ölçüsü (S, M, L...)</label>
                      <input
                        type="text"
                        placeholder="Məs. S, M, L və ya 38, 39"
                        value={prodSize}
                        onChange={(e) => setProdSize(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-black text-neutral-500 uppercase">Endirim Faizi (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        placeholder="Məs. 15"
                        value={prodDiscount}
                        onChange={(e) => setProdDiscount(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!prodTitleAz || !prodPrice) {
                        alert('Zəhmət olmasa Məhsul Adı (AZ) və Qiyməti mütləq qeyd edin.');
                        return;
                      }

                      const newProduct: Product = {
                        id: 'item-' + Math.floor(Math.random() * 9000 + 1000),
                        title_az: prodTitleAz,
                        title_en: prodTitleEn || prodTitleAz,
                        title_ru: prodTitleRu || prodTitleAz,
                        description_az: prodDesc || 'Avropadan seçilmiş və sınırlı sayda olan xüsusi butik məhsulu.',
                        price: parseFloat(prodPrice),
                        category: prodCat,
                        image: prodImage || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format',
                        stock: Math.max(0, parseInt(prodStock, 10) || 0),
                        size: prodSize || undefined,
                        discountPercent: Math.min(99, Math.max(0, parseInt(prodDiscount, 10) || 0)),
                      };

                      setProducts(prev => [newProduct, ...prev]);
                      addLog('product_added', `YENİ MƏHSUL: "${newProduct.title_az}" vitrinə vuruldu.`);
                      alert(t.newProductSuccess || 'Məhsul uğurla artırıldı!');

                      // reset fields
                      setProdTitleAz('');
                      setProdTitleEn('');
                      setProdTitleRu('');
                      setProdDesc('');
                      setProdPrice('');
                      setProdSize('');
                      setProdDiscount('0');
                      setProdStock('10');
                    }}
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow cursor-pointer text-center"
                  >
                    {t.productSaveBtn || 'Bazaya Yaz və Vitrinə At'}
                  </button>
                </div>

                {/* Grid Lists inventory */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm space-y-4">
                  <h5 className="font-extrabold text-neutral-900 flex items-center space-x-2 text-sm uppercase">
                    <Tag className="w-4 h-4 text-emerald-800" />
                    <span>Məhsul Kataloqu & Qiymətlər ({products.length})</span>
                  </h5>

                  <div className="overflow-x-auto border border-red-100 rounded-2xl max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-xs divide-y divide-neutral-100/75 text-neutral-700">
                      <thead className="bg-[#FAF9F5] font-black text-[10px] uppercase border-b">
                        <tr>
                          <th className="p-3">Kod</th>
                          <th className="p-3">Adı (AZ)</th>
                          <th className="p-3">Qiymət</th>
                          <th className="p-3">Endirim (%)</th>
                          <th className="p-3">Stok</th>
                          <th className="p-3 text-right">Fəaliyyət</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-semibold text-xs">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-red-50/10">
                            <td className="p-3 font-mono font-bold text-neutral-80s">{p.id}</td>
                            <td className="p-3 text-neutral-900 truncate max-w-[150px] font-bold">
                              {p.title_az}
                            </td>
                            <td className="p-3 font-bold font-mono text-neutral-905">
                              {p.price.toFixed(2)} ₼
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={p.discountPercent || 0}
                                onChange={(e) => {
                                  const rate = Math.min(99, Math.max(0, parseInt(e.target.value, 10) || 0));
                                  setProducts(prev =>
                                    prev.map(item => (item.id === p.id ? { ...item, discountPercent: rate } : item))
                                  );
                                  addLog('product_discount_update', `"${p.title_az}" endirimi ${rate}% oldu.`);
                                }}
                                className="w-14 border rounded-lg p-1 text-center font-black text-xs bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                min="0"
                                value={p.stock || 0}
                                onChange={(e) => {
                                  const stk = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  setProducts(prev =>
                                    prev.map(item => (item.id === p.id ? { ...item, stock: stk } : item))
                                  );
                                  addLog('product_stock_update', `"${p.title_az}" stoku ${stk} ədəd təyin edildi.`);
                                }}
                                className="w-16 border rounded-lg p-1 text-center font-black text-xs bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(t.deleteProductConfirm || 'Bu məhsulu kolleksiyadan birdəfəlik silirsiniz?')) {
                                    setProducts(prev => prev.filter(item => item.id !== p.id));
                                    addLog('product_deleted', `Kataloqdan silindi: ${p.title_az}`);
                                  }
                                }}
                                className="p-2 hover:bg-neutral-100 text-red-655 rounded-xl cursor-pointer transition-all inline-flex items-center"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Categories lists management */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm space-y-4">
                  <h5 className="font-extrabold text-neutral-90s text-sm flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-red-650" />
                    <span>Vitrin Kateqoriyalar ({categories.length})</span>
                  </h5>

                  <div className="border border-red-100 rounded-2xl overflow-hidden bg-white max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs divide-y divide-neutral-100 text-neutral-700">
                      <thead className="bg-[#FAF9F5] text-[10px] uppercase font-black text-neutral-500">
                        <tr>
                          <th className="p-3.5">İkon/Emoji</th>
                          <th className="p-3.5">Kateqoriya ID</th>
                          <th className="p-3.5">Adı (AZ)</th>
                          <th className="p-3.5 text-right font-black">Fəaliyyət</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-semibold">
                        {categories.map(cat => (
                          <tr key={cat.id} className="hover:bg-red-50/10">
                            <td className="p-3.5 text-lg w-12 text-center select-none">
                              {cat.emoji || '📁'}
                            </td>
                            <td className="p-3.5 font-mono text-neutral-500">{cat.id}</td>
                            <td className="p-3.5 text-neutral-900 font-extrabold">{cat.name_az}</td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  if (categories.length <= 1) {
                                    alert('Mağazada ən azı bir kateqoriya aktiv nümayiş etdirilməlidir!');
                                    return;
                                  }
                                  if (confirm(`"${cat.name_az}" kateqoriyasını silirsiniz?`)) {
                                    setCategories(prev => prev.filter(item => item.id !== cat.id));
                                    addLog('category_deleted', `Kateqoriya birdəfəlik ləğv edildi: ${cat.name_az}`);
                                  }
                                }}
                                className="p-1 px-1.5 hover:bg-neutral-100 text-red-655 rounded-lg inline-flex items-center cursor-pointer"
                                title="Kateqoriyanı Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add categories */}
                  <div className="bg-neutral-50 p-4 border rounded-2xl space-y-3">
                    <p className="text-[10px] font-black text-neutral-550 uppercase tracking-widest text-[#8A7045]">
                      Yeni Kateqoriya əlavə et
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="ID (Məsələn: şarf)..."
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        className="border rounded-xl p-2.5 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        placeholder="Adı (Azərbaycanca)..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="border rounded-xl p-2.5 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        placeholder="Emoji (e.g. 🧣)"
                        value={newCatEmoji}
                        onChange={(e) => setNewCatEmoji(e.target.value)}
                        className="border rounded-xl p-2.5 text-xs font-semibold bg-white outline-none text-center focus:border-red-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newCatId || !newCatName) {
                          alert('Zəhmət olmasa ID və Kateqoriya adını tam şəkildə doldurun.');
                          return;
                        }
                        const exists = categories.find(c => c.id === newCatId);
                        if (exists) {
                          alert('Bu ID nömrəsi ilə kateqoriya artıq mövcuddur.');
                          return;
                        }

                        const newCategory: Category = {
                          id: newCatId,
                          name_az: newCatName,
                          name_en: newCatName,
                          name_ru: newCatName,
                          emoji: newCatEmoji || '📁',
                        };

                        setCategories(prev => [...prev, newCategory]);
                        addLog('category_added', `YENİ KATEQORİYA: "${newCategory.name_az}" yaradıldı.`);
                        alert('Yeni kateqoriya siyahıya birləşdirildi!');
                        setNewCatId('');
                        setNewCatName('');
                        setNewCatEmoji('📁');
                      }}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-emerald-900 text-white text-xs font-black rounded-xl uppercase transition-colors cursor-pointer text-center"
                    >
                      Yeni Kateqoriyanı Siyahıya Əlavə Elə
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BULK CAMPAIGN RATES */}
            {activeTab === 'discounts' && (
              <div className="space-y-6 animate-scale-up text-left">
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 space-y-4">
                  <h5 className="font-extrabold text-neutral-950 text-sm flex items-center space-x-2 font-display">
                    <Percent className="w-4 h-4 text-emerald-805" />
                    <span>Vitrin Kampaniyası və Faiz Endirimi İdarəçisi</span>
                  </h5>

                  <p className="text-xs text-neutral-550 font-medium leading-relaxed font-sans">
                    Buradan mağazanın malları üzərində fərdi, kateqoriyalı və ya bütün vitrini əhatə edən qlobal kütləvi faiz endirimləri fəallaşdıra bilərsiniz. Kampaniyanı dayandırdıqda qiymətlər əvvəlki orijinal cəkisinə sıfırlanaraq dərhal geri qayıdır.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Category bulk discount */}
                    <div className="p-4 border bg-neutral-50 border-neutral-100 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-800 uppercase tracking-tight">
                          📁 Kateqoriya Üzrə Kütləvi Endirim
                        </p>
                        <p className="text-[10px] text-neutral-550 font-medium leading-normal mt-1">
                          Seçdiyiniz geyim və ya nömrə kateqoriyasındakı malların hər birinə eyni anda toplu endirim daxil edin.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <select
                          value={bulkCatId}
                          onChange={(e) => setBulkCatId(e.target.value)}
                          className="border border-neutral-200 rounded-xl p-2.5 text-xs font-bold bg-white cursor-pointer outline-none"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.emoji} {c.name_az}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="Faiz %..."
                          value={bulkCatPct}
                          onChange={(e) => setBulkCatPct(e.target.value)}
                          className="border border-neutral-200 rounded-xl p-2 text-xs font-bold text-center outline-none focus:border-red-500 bg-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const pct = Math.min(99, Math.max(0, parseInt(bulkCatPct, 10) || 0));
                          const targetedCat = categories.find(c => c.id === bulkCatId);
                          const targetedName = targetedCat ? targetedCat.name_az : bulkCatId;

                          setProducts(prev =>
                            prev.map(p => (p.category === bulkCatId ? { ...p, discountPercent: pct } : p))
                          );
                          addLog(
                            'bulk_discount_applied',
                            `"${targetedName}" kateqoriyasındakı mallara ${pct}% endirim tətbiq rəsmi rəhbərlik tərəfindən edildi.`
                          );
                          alert(`"${targetedName}" kateqoriyasına kütləvi ${pct}% endirim yazıldı!`);
                          setBulkCatPct('');
                        }}
                        className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-950 text-white rounded-xl text-[11px] font-black transition-all cursor-pointer text-center"
                      >
                        % Kateqoriyaya Şamil Et
                      </button>
                    </div>

                    {/* Flat store-wide discount */}
                    <div className="p-4 border bg-neutral-50/70 border-neutral-100 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-800 uppercase tracking-tight">
                          🏪 Mağaza-Wide Qlobal Endirim
                        </p>
                        <p className="text-[10px] text-neutral-550 font-medium leading-normal mt-1">
                          Butundəki butun geyim, ayaqqabı və aksessuarlara birbaşa eyni endirim faizini tətbiq edin.
                        </p>
                      </div>
                      <div className="mt-2">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="Məsələn: 20%"
                          value={bulkAllPct}
                          onChange={(e) => setBulkAllPct(e.target.value)}
                          className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs font-bold text-center outline-none focus:border-red-500 bg-white"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const pct = Math.min(99, Math.max(0, parseInt(bulkAllPct, 10) || 0));
                          setProducts(prev => prev.map(p => ({ ...p, discountPercent: pct })));
                          addLog(
                            'flat_discount_applied',
                            `Qlobal fərman ilə bütün butik məhsullarına ${pct}% endirim vuruldu.`
                          );
                          alert(`Bütün butik çeşidlərinə qlobal ${pct}% endirim fəallaşdırıldı!`);
                          setBulkAllPct('');
                        }}
                        className="w-full mt-2 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[11px] font-black transition-all cursor-pointer text-center"
                      >
                        Mağazadakı Hər Şeyə % Endirim Et
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (confirm('Bütün vitrin endirimlərini dərhal ləğv etmək istəyirsiniz? Orijinal qiymətlərə qayıdır.')) {
                          setProducts(prev => prev.map(p => ({ ...p, discountPercent: 0 })));
                          addLog('all_discounts_cleared', 'Qlobal butikdə bütün endirimlər və promo aksiyalar sıfırlandı.');
                          alert('Bütün endirim faizləri sıfırlandı!');
                        }
                      }}
                      className="text-xs border text-red-600 border-red-200 bg-red-50 hover:bg-red-100 font-extrabold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Kampaniyaları Bitir & Endirimləri Sıfırla
                    </button>
                  </div>
                </div>

                {/* Active campaigns list */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm space-y-3">
                  <h5 className="font-extrabold text-neutral-900 text-sm">
                    Aktiv Endirimli Çeşidlər ({products.filter(p => (p.discountPercent || 0) > 0).length})
                  </h5>

                  <div className="border border-red-100 rounded-2xl overflow-hidden max-h-60 overflow-y-auto bg-white">
                    <table className="w-full text-left text-xs divide-y divide-neutral-100 text-neutral-700">
                      <thead className="bg-[#FAF9F5] font-black text-[10px] uppercase text-neutral-500">
                        <tr>
                          <th className="p-3">Məhsul ID</th>
                          <th className="p-3">Məhsul Adı</th>
                          <th className="p-3 text-center">Faiz (%)</th>
                          <th className="p-3">Köhnə Qiymət</th>
                          <th className="p-3 text-neutral-950 font-black">YENİ QİYMƏT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-bold text-xs text-neutral-700">
                        {products.filter(p => (p.discountPercent || 0) > 0).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-neutral-400">
                              Heç bir məhsulda endemik endirim faizi tətbiq olunmur.
                            </td>
                          </tr>
                        ) : (
                          products
                            .filter(p => (p.discountPercent || 0) > 0)
                            .map(p => {
                              const disc = p.discountPercent || 0;
                              const effective = p.price * (1 - disc / 100);
                              return (
                                <tr key={p.id} className="hover:bg-red-50/10">
                                  <td className="p-3 font-mono text-neutral-450">{p.id}</td>
                                  <td className="p-3 text-neutral-900 truncate max-w-[170px]">{p.title_az}</td>
                                  <td className="p-3 text-center text-emerald-800 font-black">-{disc}%</td>
                                  <td className="p-3 text-neutral-400 line-through font-mono">
                                    {p.price.toFixed(2)} ₼
                                  </td>
                                  <td className="p-3 text-emerald-800 font-extrabold font-mono">
                                    {effective.toFixed(2)} ₼
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CHAT ROBOT ADVANCED */}
            {activeTab === 'chat' && (
              <div className="space-y-6 animate-scale-up text-left">
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 space-y-4">
                  <h5 className="font-extrabold text-neutral-950 text-sm flex items-center space-x-2 font-display">
                    <MessageSquare className="w-5 h-5 text-emerald-805" />
                    <span>Süni Çat Robotu & Virtual CRM Mexanizmləri</span>
                  </h5>

                  <div className="p-4 border bg-neutral-50/70 border-neutral-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <span className="text-xs font-black text-neutral-800">
                        Bot Avtomat Cavab Mexanizmi (Auto-Reply Bot)
                      </span>
                      <p className="text-[10px] text-neutral-550 font-medium">
                        Müştərilərin saytdan canli-çat vasitəsilə sizə ünvanladıqları sorğularda açar söz daxil olan kimi avtomatik cavablandırılması işləri.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAutoReplyEnabled(!autoReplyEnabled);
                        addLog(
                          'auto_reply_toggle',
                          `Avtomatik robot daxil isləri ${!autoReplyEnabled ? 'AKTİV' : 'DEAKTİV'} edildi.`
                        );
                      }}
                      className={`px-4 py-2 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                        autoReplyEnabled ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {autoReplyEnabled ? '● Aktivdir' : '○ Deaktivdir'}
                    </button>
                  </div>

                  {/* Fallback settings */}
                  <div className="flex flex-col space-y-2 pt-2 text-left">
                    <span className="text-xs font-black text-neutral-80s">
                      Standart Fallback Cavab Şablonu (Söz tapılmadıqda veriləcək zəmanətli cavab)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={autoReplyFallback}
                        onChange={(e) => setAutoReplyFallback(e.target.value)}
                        className="flex-1 border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500 font-medium h-11"
                      />
                      <button
                        onClick={() => {
                          alert('Fallback cavabı rəsmi olaraq yeniləndi!');
                          addLog('fallback_saved', 'Çat robot qoruyucu standart cavabı yeniləndi.');
                        }}
                        className="px-5 py-3 bg-neutral-900 text-white hover:bg-neutral-950 rounded-xl text-xs font-black cursor-pointer text-center h-11 flex items-center"
                      >
                        Qeyd Et
                      </button>
                    </div>
                  </div>
                </div>

                {/* Keyword triggers configurations */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 space-y-4">
                  <h5 className="font-extrabold text-neutral-950 text-sm">
                    Açar Söz Avtomatik Qaydalar Xəritəsi (Keywords Maps)
                  </h5>

                  <div className="border border-red-100 rounded-2xl overflow-hidden max-h-56 overflow-y-auto bg-white">
                    <table className="w-full text-left text-xs divide-y divide-neutral-100 text-neutral-700">
                      <thead className="bg-[#FAF9F5] font-black text-[10px] uppercase text-neutral-500">
                        <tr>
                          <th className="p-3">Söz (Trigger)</th>
                          <th className="p-3">Veriləcək Hazır Cavab</th>
                          <th className="p-3 text-right">Tənzimlə</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-semibold text-xs">
                        {autoReplies.map(item => (
                          <tr key={item.id} className="hover:bg-red-50/10">
                            <td className="p-3 font-mono font-bold text-emerald-805 uppercase">
                              "{item.keyword}"
                            </td>
                            <td className="p-3 text-neutral-800 text-xs italic font-semibold text-left">
                              {item.reply}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setAutoReplies(prev => prev.filter(ar => ar.id !== item.id));
                                  addLog('keyword_rule_deleted', `"${item.keyword}" sual-cavab fərmanı uğurla silindi.`);
                                }}
                                className="p-1 hover:bg-neutral-100 text-red-655 rounded-md cursor-pointer inline-flex items-center"
                                title="Qaydanı Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Keyword Rule form */}
                  <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl space-y-3">
                    <p className="text-[10px] font-black text-neutral-550 uppercase tracking-wider text-[#8A7045]">
                      Yeni Sual-Cavab Triggeri Qurulması
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Açar söz (məs: kuryer)..."
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value.toLowerCase().trim())}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        placeholder="Müştəriyə göndəriləcək cavab mətni..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none md:col-span-2 focus:border-red-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newKeyword || !newReply) {
                          alert('Zəhmət olmasa trigger sözü və bot cavabını qeyd edin.');
                          return;
                        }

                        const newRule: AutoReplyRule = {
                          id: 'ar-' + Date.now(),
                          keyword: newKeyword,
                          reply: newReply,
                        };

                        setAutoReplies(prev => [...prev, newRule]);
                        addLog('keyword_rule_added', `"${newKeyword}" fərdi robot qaydası qoşuldu.`);
                        alert('Yeni sual-cavab triggeri uğurla yazıldı!');
                        setNewKeyword('');
                        setNewReply('');
                      }}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-emerald-900 text-white text-xs font-black rounded-xl uppercase transition-colors cursor-pointer text-center font-sans font-bold"
                    >
                      Yeni Qaydanı Robota Əlavə Elə
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: WHATSAPP SETTINGS & SYSTEM INTEGRITY */}
            {activeTab === 'whatsapp' && (
              <div className="space-y-6 animate-scale-up text-left">
                {/* Number set up */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 space-y-4 animate-fade-in">
                  <h5 className="font-extrabold text-neutral-950 text-sm flex items-center space-x-2 font-display">
                    <Phone className="w-4 h-4 text-emerald-805" />
                    <span>WhatsApp Dəstək Xətti İdarəetmə Mərkəzi</span>
                  </h5>

                  <p className="text-xs text-neutral-500 font-semibold leading-relaxed h-auto bg-[#FAF8F4] p-3 rounded-xl border">
                    Buradan müştərinin saytdakı "WhatsApp ilə Əlaqə" düymələrinə klik etdikdə yönlənəcəyi inzibati telefon nömrəsini təyin edə bilərsiniz. Bu nömrə dəyişdikdə ha.me düymələri dərhal yenilənir.
                  </p>

                  <div className="flex flex-col space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-neutral-520 uppercase tracking-widest">
                      WhatsApp Əlaqə Nömrəsi (Beynəlxalq formatda, boşluqsuz, məsələn: 994508281993)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value.replace(/\s+/g, ''))}
                        className="flex-1 border rounded-xl p-3 text-xs font-black font-mono bg-white outline-none focus:border-red-500 text-sm tracking-wide"
                        placeholder="e.g. 994508281993"
                      />
                      <button
                        onClick={() => {
                          alert(`WhatsApp nömrəsi qeydə alındı: ${getFormattedWhatsAppNumber(whatsappNumber)}`);
                          addLog('wa_number_updated', `WhatsApp əsas nümayəndə nömrəsi "${whatsappNumber}" oldu.`);
                        }}
                        className="px-5 py-3 bg-neutral-900 hover:bg-neutral-950 text-white font-black rounded-xl text-xs transition-colors cursor-pointer text-center"
                      >
                        Nömrəni Dəyiş
                      </button>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-extrabold block">
                      ✓ Hazırda Aktiv Format: {formattedWhatsApp}
                    </span>
                  </div>
                </div>

                {/* Simulated CRM queries */}
                <div className="bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 space-y-4">
                  <h5 className="font-extrabold text-neutral-955 text-sm">
                    Müştəri Gələn WhatsApp Sualları və CRM Jurnalları
                  </h5>
                  <p className="text-[10px] text-neutral-450 font-medium leading-relaxed">
                    Aşağıdakılar, müştərilərin butikin çeşidləri ilə bağlı CRM bazasından canlandırdığı sorğulardır. Cavab yazdıqda onların telefon nömrələrinə dərhal rəsmi pre-filled keçid aktivləşir.
                  </p>

                  <div className="border border-red-100 rounded-2xl overflow-hidden bg-white max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs divide-y divide-neutral-100 text-neutral-700">
                      <thead className="bg-[#FAF9F5] font-black text-[10px] uppercase text-neutral-550 border-b">
                        <tr>
                          <th className="p-3">Müştəri / Nömrə</th>
                          <th className="p-3">Son Yazdığı Mesaj</th>
                          <th className="p-3">Durum</th>
                          <th className="p-3 text-right">Fəaliyyət</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-xs font-semibold">
                        {whatsappContacts.map(contact => (
                          <tr key={contact.id} className="hover:bg-red-50/10">
                            <td className="p-3 text-left">
                              <p className="font-black text-neutral-950">{contact.name}</p>
                              <p className="text-[9px] text-neutral-400 font-bold font-mono mt-0.5">
                                {contact.phone}
                              </p>
                            </td>
                            <td className="p-3 text-left">
                              <p className="text-neutral-600 italic font-medium truncate max-w-[200px]">
                                "{contact.lastMsg}"
                              </p>
                              <span className="text-[8px] text-neutral-450 block mt-0.5 font-mono">
                                {contact.time}
                              </span>
                            </td>
                            <td className="p-3 text-left">
                              <span
                                className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  contact.replied
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800 animate-pulse'
                                }`}
                              >
                                {contact.replied ? 'CAVABLANIB' : 'GÖZLƏYİR'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  const cleanPhone = contact.phone.replace(/\D/g, '');
                                  const greetingText = `Salam ${contact.name}! Sizin Memi Qəbələ canli dəstək platformasından yazdığınız sualı böyük məmnuniyyətlə cavablandırmaq istərdik.`;
                                  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(greetingText)}`;
                                  window.open(url, '_blank');

                                  // mark as replied
                                  setWhatsappContacts(prev =>
                                    prev.map(c => (c.id === contact.id ? { ...c, replied: true } : c))
                                  );
                                  addLog(
                                    'wa_contact_replied',
                                    `"${contact.name}" adlı müştərinin WhatsApp sorğusuna inzibati CRM keçid edildi.`
                                  );
                                }}
                                className="p-1.5 px-3 bg-[#C2A476] hover:bg-neutral-900 text-white rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer mx-auto shadow-sm border border-gold-200"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Cavab Yaz</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Password Change form */}
                <div className="space-y-4 bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-90s animate-fade-in">
                  <h5 className="font-extrabold text-neutral-950 text-sm flex items-center space-x-2 font-display">
                    <Lock className="w-4 h-4 text-emerald-805" />
                    <span>Müdir Giriş Şifrəsini Yenilə</span>
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Current Password (Cari):
                      </label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500 font-mono tracking-widest text-[#AF9164]"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        New Password (Yeni):
                      </label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500 font-mono tracking-widest text-[#AF9164]"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Confirm New (Yeni təkrarı):
                      </label>
                      <input
                        type="password"
                        placeholder="••••"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="border rounded-xl p-3 text-xs font-semibold bg-white outline-none focus:border-red-500 font-mono tracking-widest text-[#AF9164]"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (oldPass !== adminPassword) {
                        alert(t.wrongOldPassword || 'Cari şifrə yanlışdır!');
                        return;
                      }
                      if (newPass !== confirmPass) {
                        alert(t.passwordMismatch || 'Şifrələr uyuşmur!');
                        return;
                      }
                      if (!newPass) {
                        alert('Yeni şifrə boş daxil edilə bilməz!');
                        return;
                      }

                      localStorage.setItem('qeb_pass_v2', newPass);
                      setAdminPassword(newPass);
                      addLog('password_changed', 'İdarə paneli giriş şifrəsi kamil sürətdə təzələndi.');
                      alert(t.passwordChangeSuccess || 'Şifrə yeniləndi!');

                      setOldPass('');
                      setNewPass('');
                      setConfirmPass('');
                    }}
                    className="w-full py-3 bg-neutral-905 hover:bg-emerald-900 text-white text-xs font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    {t.changePasswordTitle || 'Giriş Şifrəsini Yenilə'}
                  </button>
                </div>
              </div>
            )}

            {/* EVENT EVENT LOGS BAR - FIXED ON LOWER END FOOTER OF POPUP FOR AUDIBILITY */}
            <div className="space-y-3 bg-white p-6 border border-red-150 rounded-3xl shadow-sm text-neutral-900 mt-4">
              <div className="flex justify-between items-center bg-white">
                <h5 className="font-extrabold text-neutral-950 flex items-center space-x-2 text-sm uppercase">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{t.historyTitle || 'Sistem Tarixcəsi'}</span>
                </h5>
                <button
                  onClick={() => {
                    if (confirm(t.cleanHistoryConfirm || 'Sistem jurnalları silinsin?')) {
                      setLogs([
                        {
                          id: 'log-1',
                          action: 'system',
                          message_az: 'Sistem jurnalları təmizləndi.',
                          timestamp: new Date().toISOString(),
                        },
                      ]);
                    }
                  }}
                  className="text-[10px] text-red-600 hover:underline font-black cursor-pointer uppercase tracking-wider"
                >
                  {t.cleanHistoryBtn || 'Tarixcəni Təmizlə'}
                </button>
              </div>

              <div className="border border-neutral-100 rounded-2xl max-h-40 overflow-y-auto p-4 space-y-2 bg-[#FAF9F5]/40 text-left hide-scrollbar">
                {logs.length === 0 ? (
                  <p className="text-center text-xs text-neutral-400 font-semibold py-4">
                    {t.historyEmpty || 'Əməliyyat tapılmadı.'}
                  </p>
                ) : (
                  logs.map(log => (
                    <div
                      key={log.id}
                      className="text-[11px] flex justify-between items-center bg-white p-2.5 rounded-xl border border-red-50/70"
                    >
                      <div className="text-left flex items-center gap-2 max-w-[80%]">
                        <span className="font-extrabold uppercase text-[8px] bg-emerald-100/60 border border-emerald-250 px-1.5 py-0.5 rounded text-emerald-800 shrink-0 select-none">
                          {log.action}
                        </span>
                        <span className="text-neutral-805 font-bold truncate">
                          {log.message_az}
                        </span>
                      </div>
                      <span className="text-neutral-400 font-mono text-[9px] shrink-0 font-bold select-none">
                        {new Date(log.timestamp).toLocaleTimeString('az')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
