// App Kit Types - Based on @circle-fin/app-kit SDK
// These types mirror the official App Kit SDK types

export type Blockchain = 
  | 'ethereum' 
  | 'polygon' 
  | 'avalanche' 
  | 'arbitrum' 
  | 'optimism' 
  | 'base' 
  | 'solana' 
  | 'stellar'
  | 'arc_testnet';

export type Token = 'USDC' | 'USDT' | 'EURC';

export type BridgeSpeed = 'FAST' | 'SLOW';

export type TransactionStatus = 'pending' | 'success' | 'error' | 'retryable_error';

export interface BridgeParams {
  fromChain: Blockchain;
  toChain: Blockchain;
  fromToken: Token;
  toToken: Token;
  amount: string;
  recipientAddress: string;
  speed?: BridgeSpeed;
}

export interface SwapParams {
  chain: Blockchain;
  fromToken: Token;
  toToken: Token;
  amount: string;
  slippageBps?: number;
}

export interface SendParams {
  chain: Blockchain;
  token: Token;
  amount: string;
  recipientAddress: string;
}

export interface DepositParams {
  chain: Blockchain;
  token: Token;
  amount: string;
}

export interface SpendParams {
  chain: Blockchain;
  token: Token;
  amount: string;
  recipientAddress: string;
}

export interface FeeEstimate {
  fee: string;
  feeToken: Token;
  gasEstimate?: string;
}

export interface BridgeFeeEstimate extends FeeEstimate {
  bridgeFee: string;
  bridgeFeeToken: Token;
  attestationFee?: string;
}

export interface SwapFeeEstimate extends FeeEstimate {
  swapFee: string;
  swapFeeToken: Token;
  priceImpact?: string;
}

export interface BridgeResult {
  transactionHash: string;
  status: TransactionStatus;
  fromChain: Blockchain;
  toChain: Blockchain;
  amount: string;
  token: Token;
  recipientAddress: string;
  speed: BridgeSpeed;
  steps: BridgeStep[];
  isRetryableError?: boolean;
  errorMessage?: string;
}

export interface SwapResult {
  transactionHash: string;
  status: TransactionStatus;
  chain: Blockchain;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  priceImpact: string;
  isRetryableError?: boolean;
  errorMessage?: string;
}

export interface SendResult {
  transactionHash: string;
  status: TransactionStatus;
  chain: Blockchain;
  token: Token;
  amount: string;
  recipientAddress: string;
  isRetryableError?: boolean;
  errorMessage?: string;
}

export type BridgeStepType = 'approve' | 'burn' | 'attestation' | 'mint';

export interface BridgeStep {
  type: BridgeStepType;
  status: TransactionStatus;
  transactionHash?: string;
  errorMessage?: string;
}

export interface UnifiedBalance {
  totalUsd: string;
  balances: ChainBalance[];
}

export interface ChainBalance {
  chain: Blockchain;
  token: Token;
  amount: string;
  usdValue: string;
}

export interface SupportedChain {
  id: Blockchain;
  name: string;
  logo: string;
  nativeToken: Token;
  supportedTokens: Token[];
  isTestnet: boolean;
}

export interface SupportedToken {
  symbol: Token;
  name: string;
  decimals: number;
  logo: string;
  contractAddresses: Partial<Record<Blockchain, string>>;
}

export interface AppKitEvents {
  'bridge.approve': (data: { txHash: string }) => void;
  'bridge.burn': (data: { txHash: string }) => void;
  'bridge.attestation': (data: { attestation: string }) => void;
  'bridge.mint': (data: { txHash: string }) => void;
  'bridge.complete': (data: BridgeResult) => void;
  'bridge.error': (data: { error: Error; isRetryable: boolean }) => void;
  'swap.approve': (data: { txHash: string }) => void;
  'swap.swap': (data: { txHash: string }) => void;
  'swap.complete': (data: SwapResult) => void;
  'swap.error': (data: { error: Error; isRetryable: boolean }) => void;
  'send.transfer': (data: { txHash: string }) => void;
  'send.complete': (data: SendResult) => void;
  'send.error': (data: { error: Error; isRetryable: boolean }) => void;
  'unifiedBalance.deposit': (data: { txHash: string }) => void;
  'unifiedBalance.spend': (data: { txHash: string }) => void;
  'unifiedBalance.complete': (data: UnifiedBalance) => void;
}

export interface AppKitConfig {
  apiKey: string;
  environment: 'testnet' | 'mainnet';
  adapters: {
    viem?: any;
    ethers?: any;
    solana?: any;
  };
}