'use client';

import * as React from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldError } from '@/components/ui/Input';
import { ReceiptCard, CardContent } from '@/components/ui/Card';
import { useSendPayment } from '@/hooks/useSendPayment';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { useToast } from '@/components/ui/Toast';
import { TOKEN_LIST, type TokenSymbol } from '@/lib/tokens';
import { isValidAddress, truncateAddress, explorerTxUrl, formatAmount, cn } from '@/lib/format';

interface SendPaymentFormProps {
  initialRecipient?: string;
  initialAmount?: string;
  initialToken?: TokenSymbol;
  initialNote?: string;
}

export function SendPaymentForm({
  initialRecipient = '',
  initialAmount = '',
  initialToken = 'USDC',
  initialNote = '',
}: SendPaymentFormProps) {
  const { isConnected } = useAccount();
  const { usdc, eurc, refetch } = useTokenBalances();
  const { send, status, hash, errorMessage, reset } = useSendPayment();
  const { push } = useToast();

  const [token, setToken] = React.useState<TokenSymbol>(initialToken);
  const [recipient, setRecipient] = React.useState(initialRecipient);
  const [amount, setAmount] = React.useState(initialAmount);
  const [note, setNote] = React.useState(initialNote);
  const [touched, setTouched] = React.useState(false);

  const balance = token === 'USDC' ? usdc : eurc;
  const recipientValid = recipient.length === 0 || isValidAddress(recipient);
  const amountNumber = parseFloat(amount || '0');
  const overBalance = balance !== undefined && amountNumber > parseFloat(balance);
  const canSubmit =
    isConnected &&
    isValidAddress(recipient) &&
    amountNumber > 0 &&
    !overBalance &&
    status !== 'signing' &&
    status !== 'pending';

  const busy = status === 'signing' || status === 'pending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    await send(token, recipient as `0x${string}`, amount);
  };

  React.useEffect(() => {
    if (status === 'success') {
      refetch();
      push({ variant: 'success', title: 'Payment sent', description: `${amount} ${token} to ${truncateAddress(recipient)}` });
    }
    if (status === 'error' && errorMessage) {
      push({ variant: 'error', title: 'Payment failed', description: errorMessage });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === 'success' && hash) {
    return (
      <ReceiptCard>
        <CardContent className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 2.2, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="pointer-events-none absolute right-5 top-5 rounded-full border-[3px] border-seal-green/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-seal-green"
          >
            Paid
          </motion.div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Payment receipt</p>
          <p className="mt-2 font-mono text-3xl font-semibold text-ink">
            {formatAmount(amount, 6)} <span className="text-lg text-ink/50">{token}</span>
          </p>
          <div className="mt-4 space-y-1.5 border-t border-dashed border-paper-line pt-4 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>To</span>
              <span className="font-mono text-ink">{truncateAddress(recipient)}</span>
            </div>
            {note && (
              <div className="flex justify-between text-ink/60">
                <span>Note</span>
                <span className="max-w-[60%] truncate text-right text-ink">{note}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/60">
              <span>Network</span>
              <span className="text-ink">Arc Testnet</span>
            </div>
          </div>
          <a
            href={explorerTxUrl(hash)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-paper-line py-2 text-xs text-ink/70 hover:border-seal-green/50 hover:text-seal-green"
          >
            View on ArcScan <ExternalLink className="h-3 w-3" />
          </a>
          <Button
            variant="secondary"
            className="mt-3 w-full bg-transparent text-ink border border-paper-line hover:bg-paper-dim"
            onClick={() => {
              reset();
              setRecipient('');
              setAmount('');
              setNote('');
              setTouched(false);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Send another payment
          </Button>
        </CardContent>
      </ReceiptCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <Label htmlFor="recipient">Recipient address</Label>
        <Input
          id="recipient"
          placeholder="0x…"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
          onBlur={() => setTouched(true)}
          error={touched && !recipientValid ? 'invalid' : undefined}
          className="font-mono"
        />
        <FieldError>{touched && !recipientValid ? 'Enter a valid wallet address' : undefined}</FieldError>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label className="mb-0">Amount</Label>
          <button
            type="button"
            onClick={() => balance && setAmount(balance)}
            className="text-xs text-ink/40 hover:text-seal-green"
          >
            Balance: {balance ? formatAmount(balance, 4) : '—'} {token}
          </button>
        </div>
        <div className="relative">
          <Input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              if (/^\d*\.?\d*$/.test(e.target.value)) setAmount(e.target.value);
            }}
            className="pr-16 font-mono text-lg"
            error={overBalance ? 'over' : undefined}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink/40">{token}</span>
        </div>
        <FieldError>{overBalance ? 'Amount exceeds your balance' : undefined}</FieldError>
      </div>

      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Input
          id="note"
          placeholder="What's this for?"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 80))}
        />
      </div>

      {!isConnected && (
        <p className="rounded-lg bg-paper-dim px-3 py-2 text-center text-xs text-ink/50">
          Connect your wallet to send a payment
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit} loading={busy}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {status === 'signing' ? 'Confirm in wallet…' : 'Settling on Arc…'}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send payment
          </>
        )}
      </Button>

      <AnimatePresence>
        {status === 'error' && errorMessage && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg border border-seal-rust/30 bg-seal-rust/5 px-3 py-2 text-xs text-seal-rust"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
