import { AppKit, Blockchain, Token } from '@/lib/appkit-types';
import { viemAdapter } from '@circle-fin/adapter-viem-v2';

let appKitInstance: AppKit | null = null;

export function getAppKit(): AppKit {
  if (!appKitInstance) {
    appKitInstance = new AppKit({
      adapter: viemAdapter,
      chain: Blockchain.Arc_Testnet,
    });
  }
  return appKitInstance;
}

export { Blockchain, Token, BridgeParams, SwapParams, SendParams, DepositParams, SpendParams } from '@/lib/appkit-types';
export type { AppKit } from '@/lib/appkit-types';