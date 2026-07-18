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
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  {
    id: '4',
    type: 'bridge',
    status: 'pending',
    chain: 'arc_testnet',
    fromChain: 'arc_testnet',
    toChain: 'arbitrum',
    fromToken: 'USDC',
    toToken: 'USDC',
    amount: '500.00',
    fee: '0.0012',
    feeToken: 'USDC',
    txHash: '0x1a2b...e4f5',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    speed: 'SLOW',
  },
  {
    id: '5',
    type: 'send',
    status: 'error',
    chain: 'arc_testnet',
    fromToken: 'USDC',
    amount: '25.00',
    fee: '0.0001',
    feeToken: 'USDC',
    txHash: '0x3c4d...a6b7',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    recipient: '0xabc1...def2',
    errorMessage: 'Insufficient gas',
  },
];

const chainNames: Record<string, string> = {
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
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null);
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

  const formatAmount = (amount: string, token: Token) => {
    return `${parseFloat(amount).toLocaleString()} ${token}`;
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-gray-400 mt-1">Track all your sends, bridges, and swaps</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['all', 'send', 'bridge', 'swap'] as const).map(f => {
                const FilterIcon = typeIcons[f];
                return (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="whitespace-nowrap gap-2"
                  >
                    {f === 'all' ? (
                      <>All <span className="text-xs opacity-70">{mockTransactions.length}</span></>
                    ) : (
                      <>
                        <FilterIcon className="h-3.5 w-3.5" />
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className="text-xs opacity-70">
                          {mockTransactions.filter(t => t.type === f).length}
                        </span>
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
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
                  <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                    <GitBranch className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">No transactions found</h3>
                  <p className="text-gray-400">Try a different filter or make your first transaction</p>
                </CardContent>
              </Card>
            ) : (
              filteredTxs.map((tx, index) => {
                const TypeIcon = typeIcons[tx.type];
                const StatusIcon = statusConfig[tx.status].icon;
                const RouteIcon = ChevronRight;

                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleToggleExpand(tx.id)}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-all duration-200 hover:border-cyan-500/20 cursor-pointer">
                      <CardContent className="p-4">
                        {/* Main Row */}
                        <div className="flex items-center gap-4">
                          {/* Type Badge */}
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                            typeColors[tx.type]
                          )}>
                            <TypeIcon className="h-5 w-5" />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white truncate">
                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                {tx.type === 'bridge' && tx.fromChain && tx.toChain && (
                                  <> {tx.fromChain} \u2192 {tx.toChain}</>
                                )}
                              </span>
                              {tx.speed && (
                                <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-800 border border-gray-700 text-gray-300">
                                  {tx.speed}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                              <span className="truncate">{formatAmount(tx.amount, tx.fromToken)}</span>
                              {tx.toToken && tx.fromToken !== tx.toToken && (
                                <>
                                  <span className="text-gray-600">\u2192</span>
                                  <span className="truncate">{formatAmount(tx.amount, tx.toToken)}</span>
                                </>
                              )}
                              <span className="text-gray-500">{chainNames[tx.chain] || tx.chain}</span>
                              <span>{formatDate(tx.timestamp)}</span>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5',
                              statusConfig[tx.status].bg
                            )}>
                              <StatusIcon className={cn('h-3.5 w-3.5', statusConfig[tx.status].color)} />
                              {statusConfig[tx.status].label}
                            </div>
                            <ChevronDown className={cn('h-5 w-5 text-gray-400 transition-transform', expandedId === tx.id && 'rotate-180')} />
                          </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {expandedId === tx.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-800/50 space-y-3"
                            >
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-900/50 rounded-xl p-3">
                                  <p className="text-gray-500">Transaction Hash</p>
                                  <div className="flex items-center gap-2 mt-1 font-mono text-white truncate">
                                    <span>{tx.txHash}</span>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(tx.txHash); }}>
                                      <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                    <a href={`https://testnet.arcblock.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-300">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-xl p-3">
                                  <p className="text-gray-500">Fee</p>
                                  <p className="font-mono text-white mt-1">{tx.fee} {tx.feeToken}</p>
                                </div>
                                {tx.fromChain && tx.toChain && (
                                  <div className="bg-gray-900/50 rounded-xl p-3 col-span-2">
                                    <p className="text-gray-500">Route</p>
                                    <p className="font-medium text-white mt-1 flex items-center gap-2">
                                      <span>{chainNames[tx.fromChain] || tx.fromChain}</span>
                                      <RouteIcon className="h-4 w-4 text-gray-500" />
                                      <span>{chainNames[tx.toChain] || tx.toChain}</span>
                                    </p>
                                  </div>
                                )}
                                {tx.recipient && (
                                  <div className="bg-gray-900/50 rounded-xl p-3">
                                    <p className="text-gray-500">Recipient</p>
                                    <p className="font-mono text-white mt-1 truncate">{tx.recipient}</p>
                                  </div>
                                )}
                                {tx.errorMessage && (
                                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 col-span-2 text-red-300">
                                    <p className="text-gray-500">Error</p>
                                    <p className="mt-1">{tx.errorMessage}</p>
                                  </div>
                                )}
                              </div>
                              {tx.status === 'pending' && (
                                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3 text-yellow-300">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span>Transaction is being processed...</span>
                                </div>
                              )}
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

        {/* Loading State */}
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