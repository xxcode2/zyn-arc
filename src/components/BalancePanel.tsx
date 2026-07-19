'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Banknote } from 'lucide-react';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { formatAmount, cn } from '@/lib/format';

export function BalancePanel() {
  const { usdc, eurc, isLoading, isRefetching, refetch } = useTokenBalances();

  return (
    <div className="rounded-2xl border border-ink-line bg-ink-soft p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Available balance</p>
          <motion.p
            key={usdc}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 font-mono text-4xl font-semibold text-paper tabular-nums"
          >
            {isLoading ? '—' : `$${formatAmount(usdc ?? '0', 2)}`}
            <span className="ml-2 text-base font-normal text-muted">USDC</span>
          </motion.p>
          <p className="mt-1 font-mono text-sm text-muted">
            {isLoading ? '—' : formatAmount(eurc ?? '0', 2)} EURC available
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-full border border-ink-line p-2 text-muted hover:text-paper"
          aria-label="Refresh balance"
        >
          <RefreshCw className={cn('h-4 w-4', isRefetching && 'animate-spin')} />
        </button>
      </div>
      <a
        href="https://faucet.circle.com"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-seal-gold hover:underline"
      >
        <Banknote className="h-3.5 w-3.5" />
        Need testnet funds? Claim from Circle&rsquo;s faucet
      </a>
    </div>
  );
}
