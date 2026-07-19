'use client';

import * as React from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { erc20Abi, TOKENS, type TokenSymbol } from '@/lib/tokens';

export type SendStatus = 'idle' | 'signing' | 'pending' | 'success' | 'error';

export function useSendPayment() {
  const [status, setStatus] = React.useState<SendStatus>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { writeContractAsync, data: hash, reset: resetWrite } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: Boolean(hash) },
  });

  React.useEffect(() => {
    if (hash && isConfirming) setStatus('pending');
  }, [hash, isConfirming]);

  React.useEffect(() => {
    if (isConfirmed) setStatus('success');
  }, [isConfirmed]);

  const send = React.useCallback(
    async (token: TokenSymbol, recipient: `0x${string}`, amount: string) => {
      setErrorMessage(null);
      setStatus('signing');
      try {
        const config = TOKENS[token];
        const value = parseUnits(amount, config.decimals);
        await writeContractAsync({
          address: config.address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient, value],
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message.split('\n')[0].slice(0, 140)
            : 'The wallet rejected or failed to send this transaction.';
        setErrorMessage(message);
        setStatus('error');
      }
    },
    [writeContractAsync]
  );

  const reset = React.useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
    resetWrite();
  }, [resetWrite]);

  return { send, status, hash, errorMessage, reset };
}
