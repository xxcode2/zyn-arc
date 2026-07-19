'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: string;
  chainBalances: { chain: string; balance: string; symbol: string }[];
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const chainLogos: Record<string, string> = {
  'Arc_Testnet': '🔷',
  'Ethereum': '⟠',
  'Base': '🔵',
  'Arbitrum': '🔵',
  'Optimism': '🔴',
  'Polygon': '🟣',
  'Avalanche': '🔺',
  'Solana': '🟢',
};

export function BalanceCard({ 
  totalBalance, 
  chainBalances, 
  isLoading, 
  onRefresh,
  className 
}: BalanceCardProps) {
  const [animatedBalance, setAnimatedBalance] = React.useState(0);
  const targetBalance = parseFloat(totalBalance.replace(/,/g, '')) || 0;

  React.useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startValue = animatedBalance;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedBalance(startValue + (targetBalance - startValue) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [targetBalance, animatedBalance]);

  const formattedBalance = animatedBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-gray-800/50 rounded-xl animate-pulse" />
            <div className="h-12 w-64 bg-gray-800/50 rounded-xl animate-pulse" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
              <div className="h-20 bg-gray-800/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden relative', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-cyan-300 uppercase tracking-wider">Unified Balance</p>
            <p className="text-sm text-gray-400 mt-0.5">USDC across all chains</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all duration-200"
            aria-label="Refresh balances"
          >
            <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
          </button>
        </div>
        
        <motion.div
          key={formattedBalance}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-4xl font-bold text-white mb-6"
        >
          ${formattedBalance}
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {chainBalances.map((item, index) => (
            <motion.div
              key={item.chain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 hover:border-cyan-500/20 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{chainLogos[item.chain] || '⛓️'}</span>
                <span className="text-sm font-medium text-gray-300">{item.chain}</span>
              </div>
              <div className="font-mono text-lg font-semibold text-white">
                {parseFloat(item.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-sm font-normal text-gray-400 ml-1">{item.symbol}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 pt-4 border-t border-gray-800/50">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-950 font-medium hover:from-cyan-500 hover:to-blue-500 transition-all hover:shadow-[0_0_20px_rgba(95,191,255,0.4)]">
            <ArrowUpRight className="h-4 w-4" />
            Send
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 font-medium hover:border-cyan-500/30 hover:text-cyan-300 transition-all">
            <ArrowDownLeft className="h-4 w-4" />
            Receive
          </button>
        </div>
      </CardContent>
    </Card>
  );
}