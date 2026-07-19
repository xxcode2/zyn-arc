'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, History } from 'lucide-react';
import { fetchPaymentActivity } from '@/lib/history';
import { truncateAddress, formatAmount, formatRelativeTime, explorerTxUrl, cn } from '@/lib/format';

export function TransactionHistory() {
  const { address, isConnected } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ['activity', address],
    queryFn: () => fetchPaymentActivity(address as string),
    enabled: Boolean(address),
    refetchInterval: 20_000,
  });

  if (!isConnected) {
    return (
      <p className="rounded-lg bg-paper-dim px-3 py-2 text-center text-xs text-ink/50">
        Connect your wallet to see your payment activity
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-paper-dim" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-paper-line py-10 text-center">
        <History className="h-5 w-5 text-ink/30" />
        <p className="text-sm text-ink/50">No payments yet</p>
        <p className="text-xs text-ink/35">Sent and received transfers will show up here</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-paper-line">
      {data.map((item) => (
        <li key={item.hash} className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                item.direction === 'out' ? 'bg-seal-rust/10 text-seal-rust' : 'bg-seal-green/10 text-seal-green'
              )}
            >
              {item.direction === 'out' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownLeft className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {item.direction === 'out' ? 'Sent to' : 'Received from'}{' '}
                <span className="font-mono text-ink/70">{truncateAddress(item.counterparty)}</span>
              </p>
              <p className="text-xs text-ink/40">{formatRelativeTime(item.timestamp)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'font-mono text-sm tabular-nums',
                item.direction === 'out' ? 'text-seal-rust' : 'text-seal-green'
              )}
            >
              {item.direction === 'out' ? '−' : '+'}
              {formatAmount(item.amount, 4)} {item.token}
            </span>
            <a href={explorerTxUrl(item.hash)} target="_blank" rel="noreferrer" className="text-ink/30 hover:text-ink/70">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
