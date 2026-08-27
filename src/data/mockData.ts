// Mock data for the Transacty Dashboard

export interface Wallet {
  id: string;
  currency: string;
  currencyCode: string;
  region: string;
  amount: string;
  symbol: string;
  status: 'Active' | 'Inactive' | 'Unavailable';
  statusLabel?: string;        // override display text e.g. "Unavailable"
  pocketType: string;
  colorClass: string;
  type: 'currency' | 'coin';
}

export interface Transaction {
  id: string;
  transactionId: string;
  customer: string;
  type: string;
  amount: string;
  settled: string;
  fee: string | null;
  status: 'Success' | 'Failed' | 'Pending';
  date: string;
  isStrikethrough?: boolean;
}

export interface WalletDistribution {
  name: string;
  value: number;
  percentage: string;
  amount: string;
  color: string;
}

export const wallets: Wallet[] = [
  {
    id: '1',
    currency: 'BDT',
    currencyCode: 'BDT',
    region: 'Bangladesh',
    amount: '166.00',
    symbol: '৳',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-emerald-500',
    type: 'currency',
  },
  {
    id: '2',
    currency: 'USDT',
    currencyCode: 'USDT',
    region: 'India (USDT)',
    amount: '0.00',
    symbol: '₮',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-blue-500',
    type: 'coin',
  },
  {
    id: '3',
    currency: 'USDC',
    currencyCode: 'USDC',
    region: 'Europe (USDC)',
    amount: '0.00',
    symbol: '$',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-purple-500',
    type: 'coin',
  },
  {
    id: '4',
    currency: 'BRL',
    currencyCode: 'BRL',
    region: 'Brazil (PIX)',
    amount: '0.00',
    symbol: 'R$',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-yellow-500',
    type: 'currency',
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    transactionId: '97fe53b2_4fab',
    customer: '20260805070900001...',
    type: 'Bangladesh payout',
    amount: '৳ 1,000.00',
    settled: '৳ 1,000.00',
    fee: '৳ 20.00',
    status: 'Success',
    date: 'Aug 5 · 9:18 PM',
  },
  {
    id: '2',
    transactionId: 'b6e189b6_5673',
    customer: '20260805070900001...',
    type: 'Bangladesh payout',
    amount: '৳ 500.00',
    settled: '৳ 500.00',
    fee: '৳ 10.00',
    status: 'Success',
    date: 'Aug 5 · 9:15 PM',
  },
  {
    id: '3',
    transactionId: '8810f0ac_7139',
    customer: '77d570c4 d575 4a5...',
    type: 'Customer refund',
    amount: '৳ 100.00',
    settled: '৳ 100.00',
    fee: null,
    status: 'Success',
    date: 'Aug 5 · 9:01 PM',
  },
  {
    id: '4',
    transactionId: 'c04c098a_9775',
    customer: '77d570c4 d575 4a5...',
    type: 'Customer transfer',
    amount: '৳ 100.00',
    settled: '৳ 100.00',
    fee: null,
    status: 'Success',
    date: 'Aug 5 · 9:00 PM',
  },
  {
    id: '5',
    transactionId: '208edae7_8054',
    customer: '20260805070900001...',
    type: 'Bangladesh payout',
    amount: '৳ 200.00',
    settled: '৳ 200.00',
    fee: '৳ 4.00',
    status: 'Success',
    date: 'Aug 5 · 8:54 PM',
  },
];

// BDT-specific wallet transactions (used in Wallets page)
export const bdtTransactions: Transaction[] = [
  {
    id: '1',
    transactionId: '97fe53b2_4Fab',
    customer: '20260805070900000018',
    type: 'Bangladesh payout',
    amount: '৳ 1,000.00',
    settled: '৳ 1,000.00',
    fee: '৳ 20.00',
    status: 'Success',
    date: 'Aug 5 · 9:18 PM',
  },
  {
    id: '2',
    transactionId: 'b6e189b6_5673',
    customer: '20260805070900000017',
    type: 'Bangladesh payout',
    amount: '৳ 500.00',
    settled: '৳ 500.00',
    fee: '৳ 10.00',
    status: 'Success',
    date: 'Aug 5 · 9:15 PM',
  },
  {
    id: '3',
    transactionId: '208edae7_8054',
    customer: '20260805070900000016',
    type: 'Bangladesh payout',
    amount: '৳ 200.00',
    settled: '৳ 200.00',
    fee: '৳ 4.00',
    status: 'Success',
    date: 'Aug 5 · 8:54 PM',
  },
];

export const walletDistribution: WalletDistribution[] = [
  {
    name: 'USD Coin',
    value: 40.2,
    percentage: '40.2%',
    amount: '$ 2,560.00',
    color: '#3B82F6',
  },
  {
    name: 'USDT',
    value: 35.5,
    percentage: '35.5%',
    amount: '$ 2,260.45',
    color: '#10B981',
  },
  {
    name: 'Bitcoin',
    value: 14.8,
    percentage: '14.8%',
    amount: '$ 945.20',
    color: '#F59E0B',
  },
  {
    name: 'Others',
    value: 9.5,
    percentage: '9.5%',
    amount: '$ 604.35',
    color: '#FB923C',
  },
];

export const navItems = {
  overview: [{ label: 'Dashboard', icon: 'layout-dashboard', active: true }],
  payments: [
    { label: 'Transactions', icon: 'arrow-left-right', active: false },
    { label: 'Payouts', icon: 'send', active: false },
  ],
  customers: [{ label: 'Customers', icon: 'users', active: false }],
  settings: [{ label: 'Settings', icon: 'settings', active: false }],
};
