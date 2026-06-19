import { useState, useEffect, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  Category,
  LogEntry,
  ChatMessage,
  WhatsAppContact,
  AutoReplyRule,
  BankSettings,
} from './types';
import {
  translations,
  initialSeedProducts,
  initialCategories,
} from './data';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CheckoutModal from './components/CheckoutModal';
import ChatOverlay from './components/ChatOverlay';
import AdminPanel from './components/AdminPanel';
import {
  Search,
  ShoppingBag,
  X,
  Smartphone,
  Tablet,
  MessageCircle,
  MapPin,
  Lock,
  Phone,
  Trash2,
} from 'lucide-react';

export default function App() {
  // Translate Language Manager
  const [lang, setLang] = useState<string>(() => localStorage.getItem('qeb_lang') || 'az');
  const t = (translations as any)[lang] || translations.az;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('qeb_chat_msgs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: 'bot',
            text: 'Salam! Memi Qəbələ canlı dəstək xidmətinə xoş gəlmisiniz. Avropa brendləri ilə bağlı sizə necə kömək edə bilərəm?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('qeb_products_v2');
    return saved ? JSON.parse(saved) : initialSeedProducts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('qeb_orders_v2');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ord-1002',
            customerName: 'İmran Məmmədov',
            phoneNumber: '+994 50 123 45 67',
            address: 'Qəbələ rayonu, H. Əliyev prospekti ev 45',
            paymentMethod: 'cash',
            items: [
              {
                productId: '1006',
                title_az: 'Xalis Qəbələ Dağ Balı (1 kq)',
                price: 25.0,
                quantity: 2,
              },
            ],
            totalPrice: 50.0,
            status: 'yeni',
            isPaid: false,
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('qeb_cats_v2');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('qeb_logs_v2');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log-1',
            action: 'system',
            message_az: 'Sistem rəsmi olaraq işə düşdü.',
            timestamp: new Date().toISOString(),
          },
        ];
  });

  // Basket & Overlays States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.jpg');

  // Chat Auto Reply maps
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(() => {
    const val = localStorage.getItem('qeb_auto_reply_enabled');
    return val === null ? true : val === 'true';
  });

  const [autoReplies, setAutoReplies] = useState<AutoReplyRule[]>(() => {
    const saved = localStorage.getItem('qeb_auto_replies');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ar-1',
            keyword: 'salam',
            reply: 'Salam! Memi Qəbələ butikinə xoş gəlmisiniz. Bizimlə əlaqə saxladığınız üçün təşəkkür edirik!',
          },
          {
            id: 'ar-2',
            keyword: 'endirim',
            reply: 'Seçilmiş bütün Avropa brendlərində möhtəşəm endirimlərimiz var! Hər bir geyim və ayaqqabıda endirimli qiymətlər qeyd olunub.',
          },
          {
            id: 'ar-3',
            keyword: 'çatdırılma',
            reply: 'Çatdırılmamız dərhal Qəbələ daxilinə və poçt/kuryer vasitəsilə bütün Azərbaycana sürətli şəkildə həyata keçirilir!',
          },
          {
            id: 'ar-4',
            keyword: 'qaytar',
            reply: 'Nəzərinizə çatdıraq ki, Avropadan seçilmiş və sınırlı sayda gətirilən premium geyimlərimizdə geri qaytarılma yoxdur.',
          },
          {
            id: 'ar-5',
            keyword: 'əlaqə',
            reply: 'Siz bizim WhatsApp dəstək xəttimizə də yaza bilərsiniz! Sürətli əlaqə nömrəmiz hər an aktivdir.',
          },
        ];
  });

  const [autoReplyFallback, setAutoReplyFallback] = useState<string>(() => {
    return (
      localStorage.getItem('qeb_auto_reply_fallback') ||
      'Sualınız qeydə alındı! Tezliklə sizinlə əlaqə saxlayacağıq və ya WhatsApp nömrəmizlə birbaşa yaza bilərsiniz!'
    );
  });

  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    return localStorage.getItem('qeb_whatsapp_number') || '994508281993';
  });

  const [whatsappContacts, setWhatsappContacts] = useState<WhatsAppContact[]>(() => {
    const saved = localStorage.getItem('qeb_whatsapp_contacts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'wa-c-1',
            name: 'Zaur Aliyev',
            phone: '+994 55 412 89 23',
            lastMsg: 'Vintage gödəkçənin ölçüsü varmı?',
            time: 'Dünən 18:45',
            replied: false,
          },
          {
            id: 'wa-c-2',
            name: 'Nigar Rəhimova',
            phone: '+994 70 891 00 12',
            lastMsg: 'İtalyan ipək donun başqa rəngləri var?',
            time: 'Dünən 15:30',
            replied: true,
          },
          {
            id: 'wa-c-3',
            name: 'Anar Mustafayev',
            phone: '+994 50 782 11 34',
            lastMsg: 'Bal sifariş versəm nə vaxt gələr?',
            time: 'Bugün 10:20',
            replied: false,
          },
        ];
  });

  const [bankSettings, setBankSettings] = useState<BankSettings>(() => {
    return {
      bankName: localStorage.getItem('qeb_bank_name') || 'PASHA Bank ASC',
      iban: localStorage.getItem('qeb_bank_iban') || 'AZ00PASB380000010203040506',
      swift: localStorage.getItem('qeb_bank_swift') || 'PASBAZ2D',
      ownerName: localStorage.getItem('qeb_bank_owner') || 'MEMİ QƏBƏLƏ BUTİK MMC',
      merchantId: localStorage.getItem('qeb_bank_merchant') || '8950143891',
      apiKey: localStorage.getItem('qeb_bank_key') || 'pk_live_sec_df7834a812dfb312',
      balance: parseFloat(localStorage.getItem('qeb_bank_balance') || '345.90'),
    };
  });

  // Guard to ensure Checkout Modal is strictly closed on page load/mount
  useEffect(() => {
    setIsCheckoutOpen(false);
    setCheckoutProduct(null);
  }, []);

  // SYNCHRONIZATION WITH LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('qeb_products_v2', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('qeb_orders_v2', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('qeb_cats_v2', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('qeb_logs_v2', JSON.stringify(logs));
  }, [logs]);
  useEffect(() => {
    localStorage.setItem('qeb_lang', lang);
  }, [lang]);
  useEffect(() => {
    localStorage.setItem('qeb_chat_msgs', JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem('qeb_auto_reply_enabled', autoReplyEnabled.toString());
  }, [autoReplyEnabled]);
  useEffect(() => {
    localStorage.setItem('qeb_auto_replies', JSON.stringify(autoReplies));
  }, [autoReplies]);
  useEffect(() => {
    localStorage.setItem('qeb_auto_reply_fallback', autoReplyFallback);
  }, [autoReplyFallback]);
  useEffect(() => {
    localStorage.setItem('qeb_whatsapp_number', whatsappNumber);
  }, [whatsappNumber]);
  useEffect(() => {
    localStorage.setItem('qeb_whatsapp_contacts', JSON.stringify(whatsappContacts));
  }, [whatsappContacts]);

  const addLog = (action: string, msgAz: string) => {
    const newLog: LogEntry = {
      id: 'log-' + Date.now().toString().slice(-4),
      action,
      message_az: msgAz,
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleResetDb = () => {
    setProducts(initialSeedProducts);
    setCategories(initialCategories);
    setOrders([]);
    setCart([]);
    localStorage.setItem('qeb_bank_balance', '345.90');
    setBankSettings(prev => ({ ...prev, balance: 345.9 }));
    addLog('db_reset', 'Sistem məlumat bazası tam vəziyyətlə sıfırlandı.');
    alert(lang === 'az' ? 'Baza uğurla sıfırlandı!' : 'Database defaulted successfully!');
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const azTitle = (p.title_az || '').toLowerCase();
      const enTitle = (p.title_en || '').toLowerCase();
      const ruTitle = (p.title_ru || '').toLowerCase();
      const desc = (p.description_az || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        azTitle.includes(query) ||
        enTitle.includes(query) ||
        ruTitle.includes(query) ||
        desc.includes(query);

      const matchesCat = selectedCat === 'all' || p.category === selectedCat;
      return matchesSearch && matchesCat;
    });
  }, [products, selectedCat, searchQuery]);

  const getEffectivePrice = (p: Product) => {
    const discount = p.discountPercent || 0;
    if (discount > 0) {
      return p.price * (100 - discount) / 100;
    }
    return p.price;
  };

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert(t.outOfStock || 'Məhsul tükənib!');
      return;
    }
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        if (exists.quantity >= product.stock) {
          alert(lang === 'az' ? 'Stok sayından çox sifariş edilə bilməz!' : 'Cannot exceed available stock list!');
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title_az: product.title_az,
          price: getEffectivePrice(product),
          quantity: 1,
          image: product.image,
          stock: product.stock,
          discountPercent: product.discountPercent,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > item.stock) {
              alert(lang === 'az' ? `Maksimum mövcud stok: ${item.stock} ədəd.` : `Maximum stock limit: ${item.stock}`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((Boolean) as any);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // START WIZARD CHECKOUT
  const handleStartCheckout = (product: Product | null = null) => {
    setCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmitted = (orderData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: string;
    isPaidLive: boolean;
  }) => {
    const listToPurchase = checkoutProduct
      ? [
          {
            productId: checkoutProduct.id,
            title_az: checkoutProduct.title_az,
            price: getEffectivePrice(checkoutProduct),
            quantity: 1,
          },
        ]
      : cart.map(c => ({
          productId: c.id,
          title_az: c.title_az,
          price: c.price,
          quantity: c.quantity,
        }));

    const total = checkoutProduct ? getEffectivePrice(checkoutProduct) : cartTotal;
    const newOrder: Order = {
      id: 'ord-' + (Date.now().toString().slice(-4) + Math.floor(Math.random() * 90 + 10)),
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      items: listToPurchase,
      totalPrice: total,
      status: 'yeni',
      isPaid: orderData.isPaidLive,
      createdAt: new Date().toISOString(),
    };

    // Decrease Products Stock inventory state safely
    setProducts(prev => {
      return prev.map(p => {
        const itemOrdered = listToPurchase.find(buy => buy.productId === p.id);
        if (itemOrdered) {
          return { ...p, stock: Math.max(0, p.stock - itemOrdered.quantity) };
        }
        return p;
      });
    });

    // Join lists
    setOrders(prev => [newOrder, ...prev]);

    // Financial simulated deposit metrics
    if (orderData.isPaidLive) {
      const nextBal = bankSettings.balance + total;
      localStorage.setItem('qeb_bank_balance', nextBal.toFixed(2));
      setBankSettings(prev => ({ ...prev, balance: nextBal }));
    }

    addLog(
      'order_placed',
      `Müştəri ${newOrder.customerName} tərəfindən ${newOrder.id} kodlu sifariş alındı. Məbləğ: ${total.toFixed(2)} ₼`
    );

    // Empty state
    if (!checkoutProduct) {
      setCart([]);
    }
  };

  // SEND INTERACTIVE CHATBOT MESSAGE OR AUTO REACTION
  const handleSendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const loweredInput = text.toLowerCase();
      let botResponse = '';

      if (autoReplyEnabled) {
        const matchedRule = autoReplies.find(rule => loweredInput.includes(rule.keyword.toLowerCase()));
        if (matchedRule) {
          botResponse = matchedRule.reply;
        } else {
          // Standard checks
          if (loweredInput.includes('salam')) {
            botResponse = 'Salam! Dəyərli müştərimiz. Memi Qəbələ canlı dəstək xidmətinə xoş gəlmisiniz. Sizə necə kömək edə bilərik?';
          } else if (loweredInput.includes('endirim') || loweredInput.includes('qiymət')) {
            botResponse = 'Bəli, seçilmiş premium geyim və ayaqqabılarımızda böyük endirimlər var!';
          } else if (loweredInput.includes('votsap') || loweredInput.includes('çatdırılma')) {
            botResponse = 'Çatdırılmamız dərhal Qəbələ daxilinə və poçt/kuryer vasitəsilə bütün Azərbaycana sürətlidir!';
          } else {
            botResponse = autoReplyFallback;
          }
        }
      } else {
        botResponse = 'Hazırda butik idarəçimiz digər müştəriyə xidmət edir. Şəxsi sualınız CRM bazasına ötürüldü!';
      }

      // Safeguard regex phones inside replies dynamically
      botResponse = botResponse
        .replace(/994508281993/g, whatsappNumber)
        .replace(/\+994 50 828 19 93/g, getFormattedWhatsAppNumber(whatsappNumber));

      const botMessage: ChatMessage = {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getCleanWhatsAppNumber = (num: string) => {
    return num.replace(/\D/g, '');
  };

  const getFormattedWhatsAppNumber = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('994')) {
      return `+994 (${clean.slice(3, 5)}) ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10, 12)}`;
    }
    return `+${clean}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans overflow-x-hidden">
      
      {/* TOP NOTIFICATION RIBBON */}
      <div className="bg-red-655 border-b border-red-500/10 text-white font-mono text-[10px] tracking-widest text-center py-2.5 relative flex items-center justify-center space-x-2 select-none">
        <span className="w-2 h-2 bg-[#C2A476] rounded-full animate-pulse shrink-0" />
        <span className="opacity-95 font-semibold leading-none">
          📍 QƏBƏLƏ VƏ BÜTÜN AZƏRBAYCANA SÜRƏTLİ POÇT VƏ KURYER ÇATDIRILMASI
        </span>
      </div>

      {/* HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-red-100/75 py-4 px-4 md:px-12 flex justify-between items-center transition-all duration-300 shadow-sm shadow-[#F4F7F5]/40">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => {
            setSelectedCat('all');
            setSearchQuery('');
          }}
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white overflow-hidden border border-red-100/70 shadow-sm shrink-0">
            <img
              src={logoSrc}
              alt="Memi Qəbələ Logo"
              onError={() => {
                if (logoSrc === '/logo.jpg') {
                  setLogoSrc('/logo.png');
                } else if (logoSrc === '/logo.png') {
                  setLogoSrc('/logo.svg');
                } else if (logoSrc !== 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format') {
                  setLogoSrc('https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format');
                }
              }}
              className="w-full h-full object-contain p-1 group-hover:rotate-3 duration-300 transition-transform"
            />
          </div>
          <div className="text-left leading-none">
            <h1 className="text-xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-emerald-800 to-gold-600 tracking-tight pb-0.5 select-none font-black h-6">
              {t.appName || 'MEMİ QƏBƏLƏ'}
            </h1>
            <span className="text-[9px] text-[#865F2B] font-mono font-bold uppercase tracking-wider block">
              {t.appSubtitle || 'Premium E-commerce & İdarəetmə'}
            </span>
          </div>
        </div>

        {/* Languages, Admin trigger card, and Cart badge selectors */}
        <div className="flex items-center space-x-3">
          {/* Lang buttons */}
          <div className="flex bg-[#FAF9F5] border border-red-100/70 p-0.5 rounded-xl">
            {['az', 'en', 'ru'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase transition-all duration-200 cursor-pointer ${
                  lang === l
                    ? 'bg-emerald-800 text-white shadow-sm font-black'
                    : 'text-neutral-500 hover:text-emerald-800'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center space-x-1 border border-red-100/80 hover:bg-red-50/50 px-3 py-1.5 rounded-xl text-neutral-80s text-xs font-black transition-all cursor-pointer h-9 shrink-0 shadow-sm bg-white"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl transition-all hover:scale-105 duration-200 shadow-md h-9 w-9 flex items-center justify-center cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold-500 border-2 border-[#FAF9F5] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section className="bg-gradient-to-b from-red-50/70 via-[#FAF9F5] to-white py-12 md:py-16 px-4 text-center border-b border-red-100/50 relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-emerald-800 text-[10px] font-black tracking-widest uppercase bg-emerald-50 border border-red-100/60 px-3.5 py-1.5 rounded-full inline-block select-none">
            🇦🇿 {lang === 'az' ? 'QƏBƏLƏ BUTİK' : 'GABALA EXQUISITE BRAND'}
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-[#AF9164] to-neutral-900 animate-shimmer-green font-display leading-tight py-1 font-black">
            {t.heroTitle}
          </h2>
          <p className="text-xs md:text-base text-neutral-550 font-semibold max-w-xl mx-auto leading-relaxed h-auto">
            {t.heroSubtitle}
          </p>

          {/* Combined Search component */}
          <div className="relative max-w-md mx-auto bg-white rounded-2xl border border-red-100/90 shadow-xl mt-6">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-10 py-3 text-xs bg-transparent outline-none rounded-2xl font-semibold focus:ring-1 focus:ring-emerald-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-750 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORY NAVIGATION */}
      <nav className="bg-[#FAF9F5]/95 backdrop-blur-md border-b border-red-100/60 px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar sticky top-[80px] z-20">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase transition-all duration-200 whitespace-nowrap cursor-pointer border ${
            selectedCat === 'all'
              ? 'bg-emerald-800 text-white border-emerald-900 shadow-md shadow-emerald-900/10'
              : 'bg-white text-neutral-600 border-red-100 hover:bg-red-50/40'
          }`}
        >
          📂 {t.categoryAll}
        </button>
        {categories.map(cat => {
          const name = (cat as any)['name_' + lang] || cat.name_az;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                selectedCat === cat.id
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-md shadow-emerald-900/10'
                  : 'bg-white text-neutral-600 border-red-100 hover:bg-neutral-50/50'
              }`}
            >
              {cat.emoji || '📁'} {name}
            </button>
          );
        })}
      </nav>

      {/* PRODUCTS DISPLAY GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 flex-1 w-full space-y-6">
        <h3 className="text-lg font-black tracking-tight text-neutral-900 border-b border-red-100 pb-3 font-display text-left">
          {t.productsHeader || '🔥 Seçilən Veb Məhsulları'} ({filteredProducts.length})
        </h3>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-stone-400 font-extrabold border-2 border-dashed border-red-100/80 p-6 rounded-3xl max-w-sm mx-auto flex flex-col items-center">
            <Search className="w-10 h-10 mb-3 text-stone-300" />
            <p className="text-xs">
              {lang === 'az' ? 'Axtarışa uyğun məhsul tapılmadı.' : 'No matched boutique items found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                onAddToCart={addToCart}
                onQuickOrder={handleStartCheckout}
                onView={setViewProduct}
                t={t}
              />
            ))}
          </div>
        )}
      </main>

      {/* BEN BENTO APP DOWNLOAD BANNER */}
      <section className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white py-12 px-6 border-b-2 border-emerald-800 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 text-left">
          <div className="space-y-2.5 max-w-xl text-center lg:text-left">
            <span className="text-[8px] bg-emerald-800 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {lang === 'az' ? 'Mobil Tətbiq' : 'Mobile Application'}
            </span>
            <h3 className="text-xl md:text-2xl font-black font-display leading-tight">
              {lang === 'az' ? 'Memi Qəbələ Mobil Tətbiqini Yükləyin' : 'Download Memi Boutique iOS & Android Apps'}
            </h3>
            <p className="text-[11px] text-neutral-450 font-semibold leading-relaxed">
              {lang === 'az'
                ? 'Sizin üçün həm iOS (Apple App Store), həm də Android (Google Play Store) sistemlərində premium butik təcrübəsini təqdim edirik! Bildirişləri açaraq yeni gələn Avropa geyimlərdən birinci xəbərdar olun.'
                : 'Curated clothes directly from Europe easily accessible on your personal devices. Track logistics, claim coupons, and checkout instantly.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800/80 p-3 rounded-2xl flex items-center space-x-3 transition-all hover:scale-[1.02]"
            >
              <Smartphone className="w-5 h-5 text-emerald-500" />
              <div className="text-left leading-none">
                <span className="text-[8px] uppercase font-bold text-neutral-450">Google Play</span>
                <p className="text-xs font-black text-white mt-1">Yüklə (Android)</p>
              </div>
            </a>
            <a
              href="https://www.apple.com/app-store"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800/80 p-3 rounded-2xl flex items-center space-x-3 transition-all hover:scale-[1.02]"
            >
              <Tablet className="w-5 h-5 text-sky-400" />
              <div className="text-left leading-none">
                <span className="text-[8px] uppercase font-bold text-neutral-450">App Store</span>
                <p className="text-xs font-black text-white mt-1">Yüklə (iOS)</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* WHATSAPP QUICK BUTTON ACCESS POINT */}
      <section className="bg-neutral-50/50 border-b border-red-100 py-10 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <Phone className="w-8 h-8 text-emerald-805 mx-auto" />
          <h3 className="text-xl font-black text-neutral-905">
            {lang === 'az' ? 'Sualınız Var? Bizimlə Əlaqə Saxlayın' : 'Have Special Requests? Ask Us'}
          </h3>
          <p className="text-xs text-neutral-500 font-semibold max-w-sm mx-auto leading-relaxed">
            {lang === 'az'
              ? 'Ölçü, çatdırılma və ya mövcud geyimlərlə bağlı suallarınıza 24/7 xidmət verən nümayəndəmiz dərhal cavab yazır.'
              : 'Our direct representative is online 24/7 to resolve inquiries regarding courier, orders and fits.'}
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${getCleanWhatsAppNumber(whatsappNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] duration-150 transition-all text-white px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-md select-none border-b border-emerald-800"
            >
              <MessageCircle className="w-4 h-4 text-emerald-650" />
              <span>WhatsApp: {getFormattedWhatsAppNumber(whatsappNumber)}</span>
            </a>
          </div>
        </div>
      </section>

      {/* SYSTEM CORES FOOTER */}
      <footer className="bg-neutral-950 text-white border-t-4 border-emerald-805 py-10 px-4 md:px-12 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-neutral-400">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-black text-white tracking-widest">{t.appName}</h4>
            <p className="font-bold mt-1 text-[10px]">
              © 2026. {lang === 'az' ? 'Bütün hüquqlar qorunur. Made in Qabala Azerbaijan.' : 'All rights reserved. Memi Boutique.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold justify-center">
            <a href="#" className="hover:text-emerald-500 transition-colors">Tənzimləmə qaydaları</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Kuryer sistemi</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Daxili zəmanət</a>
          </div>
        </div>
      </footer>

      {/* SHOPPING CART OVERLAY SIDEBAR DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden leading-normal">
          <div
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-all"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <h3 className="text-base font-black text-neutral-900 uppercase font-display flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4 text-emerald-800" />
                    <span>{t.cartTitle}</span>
                  </h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center text-stone-400 font-extrabold flex flex-col items-center justify-center">
                    <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">{t.cartEmpty}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-150">
                    {cart.map(item => (
                      <div key={item.id} className="py-4 flex space-x-3 text-left">
                        <img
                          src={item.image}
                          alt={item.title_az}
                          className="w-16 h-16 object-cover rounded-xl border border-neutral-200 shrink-0 bg-neutral-50"
                        />
                        <div className="flex-1 space-y-1.5">
                          <p className="font-extrabold text-neutral-900 text-xs line-clamp-1">
                            {item.title_az}
                          </p>
                          <p className="text-xs font-mono font-black text-emerald-800">
                            {item.price.toFixed(2)} ₼
                          </p>

                          {/* Counters bar */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQty(item.id, -1)}
                                className="px-2.5 py-0.5 bg-neutral-100 rounded text-xs font-black hover:bg-neutral-200 cursor-pointer text-neutral-750"
                              >
                                -
                              </button>
                              <span className="text-xs font-black font-mono leading-none">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(item.id, 1)}
                                className="px-2.5 py-0.5 bg-neutral-100 rounded text-xs font-black hover:bg-neutral-200 cursor-pointer text-neutral-750"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] text-red-600 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                              title={lang === 'az' ? 'Səbətdən çıxar' : 'Remove item'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer footer summary panel */}
              {cart.length > 0 && (
                <div className="border-t border-neutral-150 p-6 space-y-4 bg-neutral-50/50">
                  <div className="flex justify-between items-center text-xs font-black text-neutral-900">
                    <span>{t.cartTotal}</span>
                    <span className="text-xl font-mono font-black text-emerald-800">{cartTotal.toFixed(2)} ₼</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      handleStartCheckout(null);
                    }}
                    className="w-full py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md select-none uppercase tracking-wider"
                  >
                    {t.cartOrderBtn}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC COMPONENT MODALS */}
      <ProductDetailModal
        product={viewProduct}
        lang={lang}
        onClose={() => setViewProduct(null)}
        onAddToCart={addToCart}
        onQuickOrder={handleStartCheckout}
        t={t}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          checkoutProduct={checkoutProduct}
          cartTotal={cartTotal}
          t={t}
          lang={lang}
          onClose={() => setIsCheckoutOpen(false)}
          onSubmitOrder={handleOrderSubmitted}
          bankSettings={bankSettings}
        />
      )}

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        lang={lang}
        t={t}
        products={products}
        setProducts={setProducts}
        categories={categories}
        setCategories={setCategories}
        orders={orders}
        setOrders={setOrders}
        logs={logs}
        setLogs={setLogs}
        addLog={addLog}
        autoReplyEnabled={autoReplyEnabled}
        setAutoReplyEnabled={setAutoReplyEnabled}
        autoReplies={autoReplies}
        setAutoReplies={setAutoReplies}
        autoReplyFallback={autoReplyFallback}
        setAutoReplyFallback={setAutoReplyFallback}
        whatsappNumber={whatsappNumber}
        setWhatsappNumber={setWhatsappNumber}
        whatsappContacts={whatsappContacts}
        setWhatsappContacts={setWhatsappContacts}
        bankSettings={bankSettings}
        setBankSettings={setBankSettings}
        onResetDb={handleResetDb}
      />

      <ChatOverlay
        whatsappNumber={whatsappNumber}
        chatMessages={chatMessages}
        autoReplyEnabled={autoReplyEnabled}
        autoReplies={autoReplies}
        autoReplyFallback={autoReplyFallback}
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        onSendMessage={handleSendChatMessage}
        lang={lang}
        t={t}
      />

    </div>
  );
}
