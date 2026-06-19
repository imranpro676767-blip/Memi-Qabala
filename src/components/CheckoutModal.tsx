import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Check, Building2, Smartphone, ShieldAlert, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
  checkoutProduct: Product | null;
  cartTotal: number;
  t: any;
  lang: string;
  onClose: () => void;
  onSubmitOrder: (orderData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: string;
    isPaidLive: boolean;
  }) => void;
  bankSettings: {
    bankName: string;
    balance: number;
  };
}

export default function CheckoutModal({
  checkoutProduct,
  cartTotal,
  t,
  lang,
  onClose,
  onSubmitOrder,
  bankSettings,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // 1 = customer info, 2 = card info, 3 = loading redirect, 4 = success
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [payMethod, setPayMethod] = useState('cash'); // 'cash' | 'card'

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardError, setCardError] = useState('');
  const [paymentProgress, setPaymentProgress] = useState(0);

  const getEffectivePrice = (p: Product) => {
    const discount = p.discountPercent || 0;
    if (discount > 0) {
      return p.price * (100 - discount) / 100;
    }
    return p.price;
  };

  const currentTotal = checkoutProduct ? getEffectivePrice(checkoutProduct) : cartTotal;

  const validateLuhn = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    const cleanNum = num.replace(/\D/g, '');
    for (let i = cleanNum.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNum.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0 && cleanNum.length >= 13;
  };

  const handleNextStep = () => {
    if (!custName.trim() || !custPhone.trim() || !custAddress.trim()) {
      alert(lang === 'az' ? 'Zəhmət olmasa çatdırılma məlumatlarını tamamilə daxil edin!' : 'Please complete your contact and shipping options!');
      return;
    }
    if (payMethod === 'cash') {
      submitDirectly(false);
    } else {
      setStep(2);
    }
  };

  const handleCardPayment = () => {
    setCardError('');
    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (!validateLuhn(cleanCard)) {
      setCardError(lang === 'az' ? 'Yanlış kart nömrəsi! Luhn yoxlanışından keçmədi.' : 'Invalid card number! Luhn validation failed.');
      return;
    }
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setCardError(lang === 'az' ? 'Müddət yanlış daxil edilib! (AA/YY)' : 'Invalid expiry! (MM/YY)');
      return;
    }
    if (cardCVV.length < 3) {
      setCardError(lang === 'az' ? 'CVV kodu yanlışdır!' : 'CVV/CVC code must be at least 3 digits.');
      return;
    }

    // Correct, trigger simulated bank progress bar
    setStep(3);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3) {
      let progress = 0;
      interval = setInterval(() => {
        progress += 10;
        setPaymentProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          submitDirectly(true);
        }
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step]);

  const submitDirectly = (isPaidLive: boolean) => {
    onSubmitOrder({
      customerName: custName,
      phoneNumber: custPhone,
      address: custAddress,
      paymentMethod: payMethod,
      isPaidLive,
    });
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border-t-8 border-emerald-800 overflow-hidden">
        
        {step < 4 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: Customer Contact details */}
        {step === 1 && (
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-black text-neutral-900 border-b pb-2 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-800" />
              <span>{t.orderSubmitTitle || 'Sifarişi Tamamlayın'}</span>
            </h3>

            <div className="space-y-3 font-semibold text-xs text-neutral-700">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.nameLabel || 'Adınız və Soyadınız:'}</label>
                <input
                  type="text"
                  required
                  placeholder="Məsələn: Orxan Bağırov"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 bg-neutral-50/50 focus:bg-white outline-none focus:border-red-500 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.phoneLabel || 'Telefon Nömrəniz:'}</label>
                <input
                  type="text"
                  required
                  placeholder="+994 50 123 45 67"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 bg-neutral-50/50 focus:bg-white outline-none focus:border-red-500 font-medium font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.addressLabel || 'Çatdırılma Ünvanı:'}</label>
                <input
                  type="text"
                  required
                  placeholder="Qəbələ rayonu, Ü.Hacıbəyov k. ev 12"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 bg-neutral-50/50 focus:bg-white outline-none focus:border-red-500 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase tracking-wider">{t.paymentMethodLabel || 'Ödəniş Üsulu:'}</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 bg-white outline-none font-bold text-neutral-80s cursor-pointer"
                >
                  <option value="cash">{t.paymentCash || 'Qapıda Nəğd / Kuryerə Ödəniş'}</option>
                  <option value="card">{t.paymentCard || 'Onlayn Kartla Ödəniş'}</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 text-emerald-800 flex justify-between items-center text-xs border border-red-100">
              <span className="font-extrabold">{lang === 'az' ? 'Yekun Məbləğ' : 'Total Amount'}:</span>
              <span className="text-lg font-black font-mono">{currentTotal.toFixed(2)} ₼</span>
            </div>

            <div className="border-t pt-4 flex gap-2 font-bold text-xs">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
              >
                {t.cancelBtn || 'İmtina Et'}
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl transition-all cursor-pointer"
              >
                {payMethod === 'cash' ? (t.orderConfirmBtn || 'Sifarişi Təsdiqlə') : (lang === 'az' ? 'Karta Keç' : 'Pay via Card')}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Card Entries */}
        {step === 2 && (
          <div className="space-y-4 text-left">
            <div className="text-center pb-2 border-b">
              <div className="bg-red-50 h-11 w-11 rounded-2xl flex items-center justify-center text-xl mx-auto mb-1 border border-red-50 text-emerald-800">
                <CreditCard className="w-5 h-5 text-emerald-800" />
              </div>
              <h4 className="text-base font-black text-neutral-900 uppercase">
                {lang === 'az' ? 'Onlayn Kart Ödənişi' : 'Online Card Payment'}
              </h4>
              <span className="text-[10px] text-neutral-450 font-bold block">
                Secure Gateway: {bankSettings.bankName}
              </span>
            </div>

            <div className="space-y-3 font-semibold text-xs text-neutral-700">
              {cardError && (
                <div className="p-2.5 border border-red-200 bg-red-50 text-red-700 text-[10px] font-black rounded-xl text-center leading-relaxed">
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
                  {cardError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 uppercase">16 Rəqəmli Kart Nömrəsi:</label>
                <input
                  type="text"
                  placeholder="4169 7382 9102 3847"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\s+/g, '').replace(/\D/g, '');
                    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
                    setCardNumber(formatted);
                  }}
                  className="w-full border rounded-xl px-3 py-2.5 text-xs font-mono font-bold bg-white focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase">Müddət AA/YY:</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length > 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      }
                      setCardExpiry(val);
                    }}
                    className="w-full border rounded-xl px-3 py-2.5 text-xs font-mono font-bold bg-white focus:border-red-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 uppercase">CVV / CVC:</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength={3}
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                    className="w-full border rounded-xl px-3 py-2.5 text-xs font-mono font-bold bg-white focus:border-red-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 flex gap-2 text-xs font-bold">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg cursor-pointer"
              >
                {lang === 'az' ? 'Geri' : 'Back'}
              </button>
              <button
                onClick={handleCardPayment}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg cursor-pointer"
              >
                {lang === 'az' ? 'Yoxla və Ödə' : 'Check & Pay'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Secure Bank Verification Loader */}
        {step === 3 && (
          <div className="text-center py-8 space-y-6">
            <div className="relative h-16 w-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-neutral-100 border-t-emerald-800 rounded-full animate-spin" />
              <Building2 className="w-8 h-8 text-emerald-800 animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black text-neutral-800 animate-pulse uppercase tracking-wider">
                {bankSettings.bankName} Secure 3D Gateway
              </p>
              <p className="text-[10px] text-neutral-450 font-medium">
                Tranzaksiya şifrələnir və yoxlanılır. Zəhmət olmasa təhlükəsiz pəncərəni bağlamayın...
              </p>
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-neutral-400 font-bold">
              {paymentProgress}% {lang === 'az' ? 'tamamlandı' : 'verified'}
            </p>
          </div>
        )}

        {/* STEP 4: Success Message Banner */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto text-emerald-800 shadow-sm">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-neutral-950 font-display">
              {lang === 'az' ? 'Sifarişiniz Alındı!' : 'Order Placed!'}
            </h3>
            <p className="text-xs text-neutral-600 font-medium leading-relaxed bg-[#FAF9F5]/90 border border-red-100 p-3.5 rounded-2xl max-h-[170px] overflow-y-auto">
              {t.orderSuccessMsg}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              {lang === 'az' ? 'Butik Vitrinə Qayıt' : 'Back to Boutique Showcase'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
