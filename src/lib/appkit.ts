import type { AppKit } from '@/lib/appkit-types';

let appKitInstance: AppKit | null = null;

const mockAppKit: AppKit = {
  bridge: {
    estimateBridgeFee: async () => ({ fee: '0', feeToken: 'USDC', bridgeFee: '0', bridgeFeeToken: 'USDC' }),
    bridge: async () => ({ transactionHash: '0x0', status: 'success', fromChain: 'arc_testnet', toChain: 'arc_testnet', amount: '0', token: 'USDC', recipientAddress: '0x0', speed: 'FAST', steps: [] }),
    retryBridge: async () => ({ transactionHash: '0x0', status: 'success', fromChain: 'arc_testnet', toChain: 'arc_testnet', amount: '0', token: 'USDC', recipientAddress: '0x0', speed: 'FAST', steps: [] }),
  },
  swap: {
    estimateSwapFee: async () => ({ fee: '0', feeToken: 'USDC', swapFee: '0', swapFeeToken: 'USDC' }),
    swap: async () => ({ transactionHash: '0x0', status: 'success', chain: 'arc_testnet', fromToken: 'USDC', toToken: 'USDC', fromAmount: '0', toAmount: '0', priceImpact: '0%' }),
  },
  send: {
    estimateSendFee: async () => ({ fee: '0', feeToken: 'USDC' }),
    send: async () => ({ transactionHash: '0x0', status: 'success', chain: 'arc_testnet', token: 'USDC', amount: '0', recipientAddress: '0x0' }),
  },
  unifiedBalance: {
    getBalances: async () => ({ totalUsd: '0', balances: [] }),
    deposit: async () => ({ totalUsd: '0', balances: [] }),
    spend: async () => ({ totalUsd: '0', balances: [] }),
    delegate: async () => ({ totalUsd: '0', balances: [] }),
    removeFund: async () => ({ totalUsd: '0', balances: [] }),
  },
  on: () => () => undefined,
  getSupportedChains: async () => [],
} as AppKit;

export function getAppKit(): AppKit {
  if (!appKitInstance) {
    appKitInstance = mockAppKit;
  }
  return appKitInstance;
}

export type { Blockchain } from '@/lib/appkit-types';
export type { AppKit } from '@/lib/appkit-types';