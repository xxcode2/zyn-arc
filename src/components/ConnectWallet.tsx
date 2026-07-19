'use client';

import * as React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, LogOut, Copy, Check, Plug } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { truncateAddress, cn } from '@/lib/format';

export function ConnectWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const injectedConnector = connectors.find((c) => c.type === 'injected') ?? connectors[0];
  const hasProvider =
    typeof window !== 'undefined' && typeof (window as unknown as { ethereum?: unknown }).ethereum !== 'undefined';

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-paper-line/70 bg-paper/90 px-3 py-1.5 text-sm text-ink transition hover:border-seal-green/50"
        >
          <span className="h-2 w-2 rounded-full bg-seal-green" />
          <span className="font-mono text-xs">{truncateAddress(address)}</span>
        </button>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-paper-line bg-paper shadow-xl"
          >
            <button
              onClick={copyAddress}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-ink hover:bg-paper-dim"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-seal-green" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy address'}
            </button>
            <button
              onClick={() => {
                disconnect();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-seal-rust hover:bg-paper-dim"
            >
              <LogOut className="h-3.5 w-3.5" />
              Disconnect
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  if (!hasProvider) {
    return (
      <a
        href="https://metamask.io/download"
        target="_blank"
        rel="noreferrer"
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-paper-line/70 px-4 py-2 text-sm text-paper/90 hover:border-seal-gold/60'
        )}
      >
        <Plug className="h-4 w-4" />
        Install a wallet
      </a>
    );
  }

  return (
    <Button
      variant="primary"
      loading={isPending || isConnecting}
      onClick={() => injectedConnector && connect({ connector: injectedConnector })}
    >
      <Wallet className="h-4 w-4" />
      Connect wallet
    </Button>
  );
}
