// Mock data for the Transacty Dashboard

export interface Wallet {
  id: string;
  currency: string;
  currencyCode: string;
  region: string;
  amount: string;
  symbol: string;
  status: 'Active' | 'Inactive';
  pocketType: string;
  colorClass: string;
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
    amount: '1,983.72',
    symbol: '৳',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-emerald-500',
  },
  {
    id: '2',
    currency: 'USDT',
    currencyCode: 'USDT',
    region: 'India (USDT)',
    amount: '4.82',
    symbol: '₮',
    status: 'Active',
    pocketType: 'Merchant pocket',
    colorClass: 'bg-blue-500',
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
  },
];

export const transactions: Transaction[] = [
  {
    id: '1',
    transactionId: '3e77f0f1...a6...',
    customer: '20260717/...',
    type: 'Bangladesh payout',
    amount: '৳ 200.00',
    settled: '৳ 200...',
    fee: '৳ 4.00',
    status: 'Success',
    date: 'Jul 17 - 10:...',
  },
  {
    id: '2',
    transactionId: '360329a5...fc...',
    customer: 'e60177cc-4...',
    type: 'Customer transfer',
    amount: '৳ 100.00',
    settled: '৳ 100...',
    fee: null,
    status: 'Success',
    date: 'Jul 17 - 10:...',
  },
  {
    id: '3',
    transactionId: 'b26ace5a...91...',
    customer: 'Ledger',
    type: 'Brazil pay-in',
    amount: 'R$ 100.00',
    settled: 'R$ 100...',
    fee: null,
    status: 'Failed',
    date: 'Jul 2 - 4:4...',
    isStrikethrough: true,
  },
  {
    id: '4',
    transactionId: 'a2120249...42...',
    customer: 'Ledger',
    type: 'Brazil pay-in',
    amount: 'R$ 100.00',
    settled: 'R$ 100...',
    fee: null,
    status: 'Failed',
    date: 'Jul 2 - 4:4...',
    isStrikethrough: true,
  },
  {
    id: '5',
    transactionId: 'ab55a443...f1...',
    customer: 'Ledger',
    type: 'Brazil pay-in',
    amount: 'R$ 100.00',
    settled: 'R$ 100...',
    fee: null,
    status: 'Failed',
    date: 'Jul 2 - 3:4...',
    isStrikethrough: true,
  },
  {
    id: '6',
    transactionId: '67d965a5...2a...',
    customer: 'Ledger',
    type: 'Brazil pay-in',
    amount: 'R$ 100.00',
    settled: 'R$ 100...',
    fee: null,
    status: 'Failed',
    date: 'Jul 2 - 3:4...',
    isStrikethrough: true,
  },
  {
    id: '7',
    transactionId: '685e9f53...42...',
    customer: 'Ledger',
    type: 'Brazil pay-in',
    amount: 'R$ 100.00',
    settled: 'R$ 100...',
    fee: null,
    status: 'Failed',
    date: 'Jul 2 - 3:4...',
    isStrikethrough: true,
  },
];

export const walletDistribution: WalletDistribution[] = [
  {
    name: 'Bangladeshi Taka',
    value: 99.8,
    percentage: '99.8%',
    amount: '1,983.72',
    color: '#14532d',
  },
  {
    name: 'USDT',
    value: 0.2,
    percentage: '0.2%',
    amount: '₮ 4.82',
    color: '#4ade80',
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
