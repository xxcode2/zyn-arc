import { defineChain } from 'viem';

/**
 * Arc Testnet — Circle's stablecoin-native L1.
 * Params verified against Arc's official docs (docs.arc.io) as of the
 * time this app was built. Gas is paid in USDC (native, 18 decimals);
 * the ERC-20 USDC interface below uses 6 decimals and is what this
 * app reads/transfers for payments.
 */
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
      apiUrl: 'https://testnet.arcscan.app/api/v2',
    },
  },
  testnet: true,
});
