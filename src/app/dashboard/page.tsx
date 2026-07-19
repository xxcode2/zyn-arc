'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { BalanceCard } from '@/components/BalanceCard';
import { Button } from '@/components/ui/Button';
import { ExternalLink, GitBranch, ArrowLeftRight, History, Loader2, Send } from 'lucide-react';
import type { SupportedChain } from '@/lib/appkit-types';

const mockChains: SupportedChain[] = [
  { id: 'arc_testnet', name: 'Arc Testnet', logo: '🔷', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT', 'EURC'], isTestnet: true },
  { id: 'ethereum', name: 'Ethereum Sepolia', logo: 'Ξ', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
  { id: 'base', name: 'Base Sepolia', logo: '🔵', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
  { id: 'arbitrum', name: 'Arbitrum Sepolia', logo: '🔵', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
  { id: 'optimism', name: 'Optimism Sepolia', logo: '🔴', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
  { id: 'polygon', name: 'Polygon Amoy', logo: '🟣', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
  { id: 'avalanche', name: 'Avalanche Fuji', logo: '🔺', nativeToken: 'USDC', supportedTokens: ['USDC', 'USDT'], isTestnet: true },
];

const mockBalances = [
  { chain: 'Arc Testnet', balance: '12,450.00', symbol: 'USDC' },
  { chain: 'Ethereum Sepolia', balance: '5,230.50', symbol: 'USDC' },
  { chain: 'Base Sepolia', balance: '8,100.75', symbol: 'USDC' },
  { chain: 'Arbitrum Sepolia', balance: '3,420.00', symbol: 'USDC' },
  { chain: 'Optimism Sepolia', balance: '1,890.25', symbol: 'USDC' },
  { chain: 'Polygon Amoy', balance: '2,150.00', symbol: 'USDC' },
];

const quickActions = [
  { name: 'Send', href: '/send', icon: Send, color: 'from-cyan-600 to-blue-600', description: 'Transfer USDC to any address' },
  { name: 'Bridge', href: '/bridge', icon: GitBranch, color: 'from-purple-600 to-indigo-600', description: 'Move USDC across chains via CCTP' },
  { name: 'Swap', href: '/swap', icon: ArrowLeftRight, color: 'from-green-600 to-emerald-600', description: 'Exchange between stablecoins' },
  { name: 'History', href: '/history', icon: History, color: 'from-gray-600 to-gray-700', description: 'View transaction history' },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your unified USDC balance across all chains</p>
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} className="gap-2">
            <Loader2 className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        </motion.div>

        {/* Unified Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <BalanceCard
            totalBalance="33,241.50"
            chainBalances={mockBalances}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              >
                <a
                  href={action.href}
                  className="group relative block p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${action.color.replace('from-', '').replace('to-', ', ')}33)` }} />
                  <div className="relative flex flex-col items-start">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110', `bg-gradient-to-br ${action.color}`)}>
                      <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{action.name}</h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chain Balances Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Chain Balances</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBalances.map((balance, index) => (
              <motion.div
                key={balance.chain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                className="group relative p-5 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-gray-800/50 hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xl">
                      🔷
                    </div>
                    <div>
                      <p className="font-medium text-white">{balance.chain}</p>
                      <p className="text-xs text-gray-500">Testnet</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-mono text-2xl font-bold text-white">
                  {balance.balance}
                  <span className="text-sm font-normal text-gray-400 ml-1">{balance.symbol}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Supported Chains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Supported Networks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockChains.map((chain, index) => (
              <motion.div
                key={chain.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.03 }}
                className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-xl">
                    {chain.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{chain.name}</p>
                    <p className="text-xs text-gray-500">{chain.nativeToken} • {chain.supportedTokens.join(', ')}</p>
                  </div>
                  {chain.isTestnet && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Testnet
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}

function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}