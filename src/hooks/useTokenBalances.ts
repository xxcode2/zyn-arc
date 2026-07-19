'use client';

import { useAccount, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { TOKENS, erc20Abi } from '@/lib/tokens';

export function useTokenBalances() {
  const { address } = useAccount();

  const { data, isLoading, refetch, isRefetching } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: TOKENS.USDC.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: TOKENS.EURC.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
    query: {
      enabled: Boolean(address),
      refetchInterval: 15_000,
    },
  });

  const usdcRaw = data?.[0]?.result as bigint | undefined;
  const eurcRaw = data?.[1]?.result as bigint | undefined;

  return {
    usdc: usdcRaw !== undefined ? formatUnits(usdcRaw, TOKENS.USDC.decimals) : undefined,
    eurc: eurcRaw !== undefined ? formatUnits(eurcRaw, TOKENS.EURC.decimals) : undefined,
    isLoading,
    isRefetching,
    refetch,
  };
}
