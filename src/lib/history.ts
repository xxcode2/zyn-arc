import { TOKENS, type TokenSymbol } from './tokens';

export interface PaymentActivity {
  hash: string;
  direction: 'in' | 'out';
  counterparty: string;
  amount: string;
  token: TokenSymbol;
  timestamp: string;
  status: 'ok' | 'error';
}

interface BlockscoutTokenTransferItem {
  transaction_hash: string;
  from: { hash: string };
  to: { hash: string };
  total: { value: string; decimals: string };
  token: { address: string; symbol: string };
  timestamp: string;
  method?: string;
}

interface BlockscoutTokenTransfersResponse {
  items: BlockscoutTokenTransferItem[];
  next_page_params?: unknown;
}

const EXPLORER_API = 'https://testnet.arcscan.app/api/v2';
const TOKEN_ADDRESSES = new Set(
  Object.values(TOKENS).map((t) => t.address.toLowerCase())
);
const ADDRESS_TO_SYMBOL: Record<string, TokenSymbol> = Object.fromEntries(
  Object.values(TOKENS).map((t) => [t.address.toLowerCase(), t.symbol])
);

/**
 * Pulls USDC/EURC transfer history for a wallet directly from Arc's
 * public block explorer (Blockscout-compatible REST API). Returns an
 * empty array on any failure rather than throwing, so a slow or
 * unreachable explorer never breaks the payments UI.
 */
export async function fetchPaymentActivity(
  address: string
): Promise<PaymentActivity[]> {
  try {
    const res = await fetch(
      `${EXPLORER_API}/addresses/${address}/token-transfers?type=ERC-20`,
      { headers: { accept: 'application/json' } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as BlockscoutTokenTransfersResponse;
    if (!Array.isArray(data.items)) return [];

    const lowerAddress = address.toLowerCase();

    return data.items
      .filter((item) => TOKEN_ADDRESSES.has(item.token?.address?.toLowerCase()))
      .map((item) => {
        const symbol = ADDRESS_TO_SYMBOL[item.token.address.toLowerCase()];
        const decimals = TOKENS[symbol].decimals;
        const raw = BigInt(item.total?.value ?? '0');
        const divisor = BigInt(10) ** BigInt(decimals);
        const whole = raw / divisor;
        const frac = raw % divisor;
        const amount = `${whole}.${frac
          .toString()
          .padStart(decimals, '0')
          .slice(0, 6)}`;
        const isOutgoing = item.from.hash.toLowerCase() === lowerAddress;
        return {
          hash: item.transaction_hash,
          direction: isOutgoing ? 'out' : 'in',
          counterparty: isOutgoing ? item.to.hash : item.from.hash,
          amount,
          token: symbol,
          timestamp: item.timestamp,
          status: 'ok',
        } satisfies PaymentActivity;
      })
      .slice(0, 25);
  } catch {
    return [];
  }
}
