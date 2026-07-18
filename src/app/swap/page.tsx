'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmountInput } from '@/components/AmountInput';
import { ChainSelector } from '@/components/ChainSelector';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { Blockchain, Token } from '@/lib/appkit-types';
import { Loader2, CheckCircle, AlertCircle, RotateCcw, ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';

const mockChains: Blockchain[] = ['arc_testnet', 'ethereum', 'base', 'arbitrum', 'optimism'];
const mockTokens: Token[] = ['USDC', 'USDT', 'EURC'];

const chainNames: Record<Blockchain, string> = {
  arc_testnet: 'Arc Testnet',
  ethereum: 'Ethereum Sepolia',
  base: 'Base Sepolia',
  arbitrum: 'Arbitrum Sepolia',
  optimism: 'Optimism Sepolia',
  polygon: 'Polygon Amoy',
  avalanche: 'Avalanche Fuji',
};

const tokenInfo: Record<Token, { decimals: number; logo: string }> = {
  USDC: { decimals: 6, logo: '💲' },
  USDT: { decimals: 6, logo: '💲' },
  EURC: { decimals: 6, logo: '💶' },
};

export default function SwapPage() {
  const [chain, setChain] = React.useState<Blockchain>('arc_testnet');
  const [fromToken, setFromToken] = React.useState<Token>('USDC');
  const [toToken, setToToken] = React.useState<Token>('USDT');
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState('50,000.00');
  const [step, setStep] = React.useState<'form' | 'estimate' | 'confirming' | 'success' | 'error'>('form');
  const [estimate, setEstimate] = React.useState<{ outputAmount: string; priceImpact: string; fee: string; feeToken: Token; minReceived: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [txHash, setTxHash] = React.useState<string | null>(null);

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep('estimate');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const rate = fromToken === toToken ? 1 : (fromToken === 'USDC' && toToken === 'USDT' ? 0.9998 : 1.0002);
    const outAmount = parseFloat(amount) * rate * 0.999; // 0.1% fee
    
    setEstimate({
      outputAmount: outAmount.toFixed(6),
      priceImpact: '< 0.01%',
      fee: '0.001',
      feeToken: fromToken,
      minReceived: (outAmount * 0.995).toFixed(6),
    });
    setStep('confirming');
  };

  const handleSwap = async () => {
    setStep('confirming');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.05) {
      const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(hash);
      setStep('success');
      setAmount('');
    } else {
      setError('Swap failed: Price impact too high');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep('form');
  };

  const swapTokens = () => {
    if (fromToken !== toToken) {
      const temp = fromToken;
      setFromToken(toToken);
      setToToken(temp);
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && fromToken !== toToken;

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 mb-4">
            <ArrowLeftRight className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Swap Tokens</h1>
          <p className="text-gray-400 mt-2">Exchange stablecoins on the same chain with low slippage</p>
        </motion.div>

        {/* Form Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Chain Selection */}
            <ChainSelector
              value={chain}
              onChange={setChain}
              chains={mockChains.map(id => ({ id, name: chainNames[id], nativeToken: 'USDC', supportedTokens: mockTokens, isTestnet: true }))}
              label="Network"
              testnetOnly={true}
            />

            {/* Swap Interface */}
            <div className="space-y-4">
              {/* From Token */}
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-cyan-300">From</label>
                  <span className="text-xs text-gray-500">{tokenInfo[fromToken].logo} {fromToken}</span>
                </div>
                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  balance={balance}
                  symbol={fromToken}
                  decimals={tokenInfo[fromToken].decimals}
                  placeholder="0.00"
                  showMaxButton
                  onMaxClick={() => setAmount(balance.replace(/,/g, ''))}
                  error={parseFloat(amount) > parseFloat(balance.replace(/,/g, '')) ? 'Insufficient balance' : undefined}
                  disabled={step !== 'form'}
                />
                <div className="flex items-center justify-between mt-3">
                  <select
                    value={fromToken}
                    onChange={(e) => { setFromToken(e.target.value as Token); if (e.target.value === toToken) setToToken(fromToken); }}
                    className="text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {mockTokens.map(t => (
                      <option key={t} value={t}>{tokenInfo[t].logo} {t}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">Available: {parseFloat(balance).toLocaleString()} {fromToken}</span>
                </div>
              </div>

              {/* Swap Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={swapTokens}
                disabled={step !== 'form'}
                className="mx-auto"
                aria-label="Swap tokens"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              {/* To Token */}
              <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-cyan-300">To</label>
                  <span className="text-xs text-gray-500">{tokenInfo[toToken].logo} {toToken}</span>
                </div>
                
                <AnimatePresence mode="wait">
                  {step === 'form' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 font-mono text-lg text-gray-400">
                        Enter amount to see estimate
                      </div>
                    </motion.div>
                  )}

                  {(step === 'estimate' || step === 'confirming') && estimate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">You receive</span>
                          <span className="text-xs text-gray-500">Min: {estimate.minReceived} {toToken}</span>
                        </div>
                        <div className="font-mono text-2xl font-bold text-green-300">
                          {estimate.outputAmount} {toToken}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>Price impact: {estimate.priceImpact}</span>
                          <span>Fee: {estimate.fee} {estimate.feeToken}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mt-3">
                  <select
                    value={toToken}
                    onChange={(e) => { setToToken(e.target.value as Token); if (e.target.value === fromToken) setFromToken(toToken); }}
                    className="text-sm bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {mockTokens.filter(t => t !== fromToken).map(t => (
                      <option key={t} value={t}>{tokenInfo[t].logo} {t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fee Estimate */}
            <AnimatePresence mode="wait">
              {step === 'estimate' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FeeBreakdown
                    items={[
                      { label: 'Swap Fee', value: estimate?.fee || '~0.001', token: estimate?.feeToken || fromToken },
                    ]}
                    total={parseFloat(amount) + parseFloat(estimate?.fee || '0')}
                    totalToken={fromToken}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={handleEstimate}
                    disabled={!isFormValid}
                    className="w-full justify-center gap-2"
                    size="lg"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    <ArrowDownLeft className="h-4 w-4" />
                    Review & Estimate
                  </Button>
                </motion.div>
              )}

              {step === 'confirming' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3"
                >
                  <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSwap} className="flex-1 justify-center gap-2" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Swapping...
                  </Button>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="font-medium text-green-300">Swap completed successfully!</span>
                  </div>
                  {txHash && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-900/50 border border-gray-700/50 font-mono text-sm text-gray-300">
                      <span className="flex-1 truncate">{txHash}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(txHash)}>
                        Copy
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => setStep('form')} className="w-full">
                    Swap Again
                  </Button>
                </motion.div>
              )}

              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                    <span className="font-medium text-red-300">{error}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRetry} className="flex-1">
                      Try Again
                    </Button>
                    <Button variant="outline" onClick={() => setStep('form')} className="flex-1">
                      Back to Form
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <ArrowLeftRight className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">About Swaps</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Swaps happen on the same chain (no bridging)</li>
                  <li>• 0.1% swap fee + network gas (paid in USDC)</li>
                  <li>• Price impact under 0.01% for stablecoin pairs</li>
                  <li>• Slippage tolerance: 0.5% default</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}