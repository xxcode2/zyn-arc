'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { ReceiptCard, CardContent } from '@/components/ui/Card';
import { TOKEN_LIST, type TokenSymbol } from '@/lib/tokens';
import { cn } from '@/lib/format';

export function RequestPaymentForm() {
  const { address, isConnected } = useAccount();
  const [token, setToken] = React.useState<TokenSymbol>('USDC');
  const [amount, setAmount] = React.useState('');
  const [note, setNote] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const link = React.useMemo(() => {
    if (!address || typeof window === 'undefined') return '';
    const url = new URL('/pay', window.location.origin);
    url.searchParams.set('to', address);
    if (amount) url.searchParams.set('amount', amount);
    url.searchParams.set('token', token);
    if (note) url.searchParams.set('note', note);
    return url.toString();
  }, [address, amount, token, note]);

  const copyLink = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const shareLink = async () => {
    if (!link) return;
    if (navigator.share) {
      await navigator.share({ title: 'Payment request', url: link });
    } else {
      copyLink();
    }
  };

  if (!isConnected) {
    return (
      <p className="rounded-lg bg-paper-dim px-3 py-2 text-center text-xs text-ink/50">
        Connect your wallet to create a payment request
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Label>Token</Label>
        <div className="grid grid-cols-2 gap-2">
          {TOKEN_LIST.map((t) => (
            <button
              type="button"
              key={t.symbol}
              onClick={() => setToken(t.symbol)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition',
                token === t.symbol
                  ? 'border-seal-green bg-seal-green/10 text-seal-green'
                  : 'border-paper-line text-ink/60 hover:border-ink/20'
              )}
            >
              {t.symbol}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="req-amount">Amount (optional)</Label>
        <Input
          id="req-amount"
          inputMode="decimal"
          placeholder="Leave blank to let the payer choose"
          value={amount}
          onChange={(e) => {
            if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
          }}
          className="font-mono"
        />
      </div>

      <div>
        <Label htmlFor="req-note">Note (optional)</Label>
        <Input
          id="req-note"
          placeholder="What's this for?"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 80))}
        />
      </div>

      {link && (
        <ReceiptCard>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-xl border border-paper-line bg-white p-3">
              <QRCodeSVG value={link} size={148} fgColor="#0B0E14" bgColor="#ffffff" />
            </div>
            <p className="break-all font-mono text-xs text-ink/50">{link}</p>
            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-seal-green" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy link'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareLink}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </ReceiptCard>
      )}

      {!link && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-paper-line py-8 text-xs text-ink/40">
          <Link2 className="h-3.5 w-3.5" />
          Your payment link will appear here
        </div>
      )}
    </div>
  );
}
