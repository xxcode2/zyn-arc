'use client';

import * as React from 'react';
import { AppKit, Blockchain, Token } from '@/lib/appkit-types';
import { getAppKit } from '@/lib/appkit';

interface UnifiedBalance {
  totalUsd: string;
  balances: Array<{
    chain: Blockchain;
    token: Token;
    amount: string;
    usdValue: string;
  }>;
}

interface ChainBalance {
  chain: Blockchain;
  token: Token;
  amount: string;
  usdValue: string;
}

interface AppKitContextType {
  kit: AppKit | null;
  isInitialized: boolean;
  unifiedBalance: UnifiedBalance | null;
  chainBalances: ChainBalance[];
  isLoadingBalances: boolean;
  supportedChains: Blockchain[];
  supportedTokens: Token[];
  initialize: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  refreshChains: () => Promise<void>;
}

const AppKitContext = React.createContext<AppKitContextType | null>(null);

const MOCK_CHAINS: Blockchain[] = ['arc_testnet', 'ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'avalanche'];
const MOCK_TOKENS: Token[] = ['USDC', 'USDT', 'EURC'];

const MOCK_BALANCES: ChainBalance[] = [
  { chain: 'arc_testnet', token: 'USDC', amount: '1250.50', usdValue: '1250.50' },
  { chain: 'ethereum', token: 'USDC', amount: '5000.00', usdValue: '5000.00' },
  { chain: 'base', token: 'USDC', amount: '2500.00', usdValue: '2500.00' },
  { chain: 'arbitrum', token: 'USDC', amount: '1000.00', usdValue: '1000.00' },
];

const MOCK_UNIFIED: UnifiedBalance = {
  totalUsd: '9750.50',
  balances: MOCK_BALANCES,
};

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const [kit, setKit] = React.useState<AppKit | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [unifiedBalance, setUnifiedBalance] = React.useState<UnifiedBalance | null>(null);
  const [chainBalances, setChainBalances] = React.useState<ChainBalance[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = React.useState(false);
  const [supportedChains] = React.useState<Blockchain[]>(MOCK_CHAINS);
  const [supportedTokens] = React.useState<Token[]>(MOCK_TOKENS);

  const refreshBalances = React.useCallback(async () => {
    setIsLoadingBalances(true);
    try {
      setUnifiedBalance(MOCK_UNIFIED);
      setChainBalances(MOCK_BALANCES);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  }, []);

  const initialize = React.useCallback(async () => {
    if (isInitialized) return;
    try {
      const appKit = getAppKit();
      setKit(appKit);
      setIsInitialized(true);
      await refreshBalances();
    } catch (error) {
      console.error('Failed to initialize AppKit:', error);
      setIsInitialized(true);
    }
  }, [isInitialized, refreshBalances]);

  const refreshChains = React.useCallback(async () => {
    try {
      // const chains = await kit?.getSupportedChains();
    } catch (error) {
      console.error('Failed to refresh chains:', error);
    }
  }, []);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AppKitContext.Provider value={{
      kit,
      isInitialized,
      unifiedBalance,
      chainBalances,
      isLoadingBalances,
      supportedChains,
      supportedTokens,
      initialize,
      refreshBalances,
      refreshChains,
    }}>
      {children}
    </AppKitContext.Provider>
  );
}

export function useAppKit() {
  const context = React.useContext(AppKitContext);
  if (!context) {
    throw new Error('useAppKit must be used within an AppKitProvider');
  }
  return context;
}

export function useBalances() {
  const { unifiedBalance, chainBalances, isLoadingBalances, refreshBalances } = useAppKit();
  return { unifiedBalance, chainBalances, isLoadingBalances, refreshBalances };
}

export function useSupportedChains() {
  const { supportedChains, refreshChains } = useAppKit();
  return { supportedChains, refreshChains };
}

export function useSupportedTokens() {
  const { supportedTokens } = useAppKit();
  return { supportedTokens };
}