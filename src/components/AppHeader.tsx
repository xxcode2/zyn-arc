'use client';

import { ConnectWallet } from '@/components/ConnectWallet';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-seal-green font-mono text-sm font-bold text-paper">
          Z
        </div>
        <span className="font-mono text-sm font-semibold tracking-tight text-paper">
          Zyn<span className="text-seal-gold">Pay</span>
        </span>
        <span className="ml-2 hidden rounded-full border border-ink-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted sm:inline">
          Arc Testnet
        </span>
      </div>
      <ConnectWallet />
    </header>
  );
}
