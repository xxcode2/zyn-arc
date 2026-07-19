'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { AppHeader } from '@/components/AppHeader';
import { NetworkGuard } from '@/components/NetworkGuard';
import { Card, CardContent } from '@/components/ui/Card';
import { ConnectWallet } from '@/components/ConnectWallet';
import { SendPaymentForm } from '@/components/SendPaymentForm';
import { truncateAddress, isValidAddress } from '@/lib/format';
import type { TokenSymbol } from '@/lib/tokens';

function PayRequestContent() {
  const params = useSearchParams();
  const { isConnected } = useAccount();

  const to = params.get('to') ?? '';
  const amount = params.get('amount') ?? '';
  const tokenParam = params.get('token');
  const token: TokenSymbol = tokenParam === 'EURC' ? 'EURC' : 'USDC';
  const note = params.get('note') ?? '';

  const validRequest = isValidAddress(to);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <AppHeader />
      <NetworkGuard />

      <div className="mx-auto w-full max-w-md flex-1 space-y-4 px-4 pb-16 pt-8 sm:px-6">
        {!validRequest ? (
          <Card>
            <CardContent className="text-center text-sm text-ink/60">
              This payment link is missing a valid recipient address.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-muted">Payment request</p>
              <p className="mt-1 font-mono text-sm text-paper">{truncateAddress(to, 6)}</p>
              {note && <p className="mt-1 text-sm text-muted">&ldquo;{note}&rdquo;</p>}
            </div>

            {!isConnected ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                  <p className="text-sm text-ink/60">Connect your wallet to pay this request</p>
                  <ConnectWallet />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <SendPaymentForm
                    initialRecipient={to}
                    initialAmount={amount}
                    initialToken={token}
                    initialNote={note}
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function PayPage() {
  return (
    <React.Suspense fallback={null}>
      <PayRequestContent />
    </React.Suspense>
  );
}
