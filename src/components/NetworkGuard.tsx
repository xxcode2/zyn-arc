'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { arcTestnet } from '@/lib/chain';

export function NetworkGuard() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== arcTestnet.id;

  return (
    <AnimatePresence>
      {wrongNetwork && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 border-b border-seal-gold/30 bg-seal-gold/10 px-4 py-2.5 text-sm text-seal-gold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Your wallet isn&rsquo;t on Arc Testnet.</span>
            <Button
              size="sm"
              variant="outline"
              loading={isPending}
              className="border-seal-gold/50 text-seal-gold hover:bg-seal-gold/10"
              onClick={() => switchChain({ chainId: arcTestnet.id })}
            >
              Switch network
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
