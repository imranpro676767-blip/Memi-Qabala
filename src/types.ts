export interface Product {
  id: string;
  title_az: string;
  title_en: string;
  title_ru: string;
  description_az: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  size?: string;
  discountPercent?: number;
}

export interface CartItem {
  id: string;
  title_az: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  discountPercent?: number;
}

export interface OrderItem {
  productId: string;
  title_az: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name_az: string;
  name_en: string;
  name_ru: string;
  emoji?: string;
}

export interface LogEntry {
  id: string;
  action: string;
  message_az: string;
  timestamp: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  lastMsg: string;
  time: string;
  replied: boolean;
}

export interface AutoReplyRule {
  id: string;
  keyword: string;
  reply: string;
}

export interface BankSettings {
  bankName: string;
  iban: string;
  swift: string;
  ownerName: string;
  merchantId: string;
  apiKey: string;
  balance: number;
}
