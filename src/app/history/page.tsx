'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Blockchain, Token, BridgeSpeed } from '@/lib/appkit-types';
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  GitBranch,
  ArrowLeftRight,
  Send,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'bridge' | 'swap';
  status: 'pending' | 'success' | 'error';
  chain: Blockchain;
  fromChain?: Blockchain;
  toChain?: Blockchain;
  fromToken: Token;
  toToken?: Token;
  amount: string;
  fee?: string;
  feeToken?: Token;
  txHash: string;
  timestamp: Date;
  recipient?: string;
  speed?: BridgeSpeed;
  errorMessage?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'bridge',
    status: 'success',
    chain: 'arc_testnet',
    fromChain: 'arc_testnet',
    toChain: 'base',
    fromToken: 'USDC',
    toToken: 'USDC',
    amount: '100.00',
    fee: '0.0015',
    feeToken: 'USDC',
    txHash: '0x7a3f...b2e4',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    speed: 'FAST',
  },
  {
    id: '2',
    type: 'send',
    status: 'success',
    chain: 'arc_testnet',
    fromToken: 'USDC',
    amount: '50.00',
    fee: '0.0001',
    feeToken: 'USDC',
    txHash: '0x4d2a...f8c1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    recipient: '0x742d...8f5a',
  },
  {
    id: '3',
    type: 'swap',
    status: 'success',
    chain: 'arc_testnet',
    fromToken: 'USDC',
    toToken: 'USDT',
    amount: '200.00',
    fee: '0.001',
    feeToken: 'USDC',
    txHash: '0x9f1e...c3d7',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const chainNames: Record<Blockchain, string> = {
  arc_testnet: 'Arc Testnet',
  ethereum: 'Ethereum',
  base: 'Base',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  polygon: 'Polygon',
  avalanche: 'Avalanche',
  solana: 'Solana',
  stellar: 'Stellar',
};

const typeIcons = {
  send: Send,
  bridge: GitBranch,
  swap: ArrowLeftRight,
};

const typeColors = {
  send: 'text-cyan-400 bg-cyan-500/20',
  bridge: 'text-purple-400 bg-purple-500/20',
  swap: 'text-green-400 bg-green-500/20',
};

const statusConfig = {
  success: { icon: CheckCircle, color: 'text-green-400', label: 'Success', bg: 'bg-green-500/10 border-green-500/30' },
  pending: { icon: Loader2, color: 'text-yellow-400 animate-spin', label: 'Pending', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  error: { icon: AlertCircle, color: 'text-red-400', label: 'Failed', bg: 'bg-red-500/10 border-red-500/30' },
};

export default function HistoryPage() {
  const [filter, setFilter] = React.useState<'all' | 'send' | 'bridge' | 'swap'>('all');
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filteredTxs = filter === 'all' ? mockTransactions : mockTransactions.filter(tx => tx.type === filter);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amount: string, token: Token) => `${parseFloat(amount).toLocaleString()} ${token}`;

  const handleToggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-gray-400 mt-1">Track all your sends, bridges, and swaps</p>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </motion.div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'send', 'bridge', 'swap'] as const).map(f => {
                const FilterIcon = f === 'all' ? null : typeIcons[f];
                return (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="whitespace-nowrap gap-2"
                  >
                    {f === 'all' ? (
                      <>
                        All <span className="text-xs opacity-70">{mockTransactions.length}</span>
                      </>
                    ) : (
                      <>
                        {FilterIcon && <FilterIcon className="h-3.5 w-3.5" />}
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="text-xs opacity-70">{mockTransactions.filter(t => t.type === f).length}</span>
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {filteredTxs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/50">
                    <GitBranch className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">No transactions found</h3>
                  <p className="text-gray-400">Try a different filter or make your first transaction</p>
                </CardContent>
              </Card>
            ) : (
              filteredTxs.map(tx => {
                const TypeIcon = typeIcons[tx.type];
                const StatusIcon = statusConfig[tx.status].icon;
                const isExpanded = expandedId === tx.id;

                return (
                  <motion.div key={tx.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group">
                    <Card className="overflow-hidden transition-all duration-200 hover:border-cyan-500/20 cursor-pointer">
                      <CardContent className="p-4" onClick={() => handleToggleExpand(tx.id)}>
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${typeColors[tx.type]}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-medium text-white">
                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                {tx.type === 'bridge' && ` ${tx.fromChain} → ${tx.toChain}`}
                              </span>
                              {tx.speed && (
                                <span className="rounded-full border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                                  {tx.speed}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                              <span className="truncate">{formatAmount(tx.amount, tx.fromToken)}</span>
                              {tx.toToken && tx.fromToken !== tx.toToken && (
                                <>
                                  <span className="text-gray-600">→</span>
                                  <span className="truncate">{formatAmount(tx.amount, tx.toToken)}</span>
                                </>
                              )}
                              <span className="text-gray-500">{chainNames[tx.chain]}</span>
                              <span>{formatDate(tx.timestamp)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusConfig[tx.status].bg}`}>
                              <StatusIcon className={`h-3.5 w-3.5 ${statusConfig[tx.status].color}`} />
                              {statusConfig[tx.status].label}
                            </div>
                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-3 border-t border-gray-800/50 pt-4">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-gray-900/50 p-3">
                                  <p className="text-gray-500">Transaction Hash</p>
                                  <div className="mt-1 flex items-center gap-2 font-mono text-white">
                                    <span className="truncate">{tx.txHash}</span>
                                    <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(tx.txHash); }}>
                                      <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="rounded-xl bg-gray-900/50 p-3">
                                  <p className="text-gray-500">Fee</p>
                                  <p className="mt-1 font-mono text-white">{tx.fee} {tx.feeToken}</p>
                                </div>
                                {tx.fromChain && tx.toChain && (
                                  <div className="col-span-2 rounded-xl bg-gray-900/50 p-3">
                                    <p className="text-gray-500">Route</p>
                                    <p className="mt-1 flex items-center gap-2 font-medium text-white">
                                      <span>{chainNames[tx.fromChain]}</span>
                                      <ChevronRight className="h-4 w-4 text-gray-500" />
                                      <span>{chainNames[tx.toChain]}</span>
                                    </p>
                                  </div>
                                )}
                                {tx.recipient && (
                                  <div className="rounded-xl bg-gray-900/50 p-3">
                                    <p className="text-gray-500">Recipient</p>
                                    <p className="mt-1 truncate font-mono text-white">{tx.recipient}</p>
                                  </div>
                                )}
                                {tx.errorMessage && (
                                  <div className="col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-300">
                                    <p className="text-gray-500">Error</p>
                                    <p className="mt-1">{tx.errorMessage}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more transactions...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

