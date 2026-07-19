'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AmountInput } from '@/components/AmountInput';
import { ChainSelector } from '@/components/ChainSelector';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { TxStepper } from '@/components/TxStepper';
import { Blockchain, Token, BridgeSpeed, SupportedChain } from '@/lib/appkit-types';
import { GitBranch, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy, ArrowLeftRight, RotateCcw, ChevronRight } from 'lucide-react';

const mockChains: Blockchain[] = ['arc_testnet', 'ethereum', 'base', 'arbitrum', 'optimism', 'polygon', 'avalanche'];
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

const bridgeSteps = [
  { id: 'approve', label: 'Approve', description: 'Authorize USDC spending on source chain' },
  { id: 'burn', label: 'Burn', description: 'Burn USDC on source chain via TokenMessenger' },
  { id: 'attestation', label: 'Attestation', description: 'Wait for Circle attestation service' },
  { id: 'mint', label: 'Mint', description: 'Mint USDC on destination chain' },
];

export default function BridgePage() {
  const [fromChain, setFromChain] = React.useState<Blockchain>('arc_testnet');
  const [toChain, setToChain] = React.useState<Blockchain>('base');
  const [fromToken, setFromToken] = React.useState<Token>('USDC');
  const [toToken, setToToken] = React.useState<Token>('USDC');
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState('50,000.00');
  const [speed, setSpeed] = React.useState<BridgeSpeed>('FAST');
  const [step, setStep] = React.useState<'form' | 'estimate' | 'confirming' | 'executing' | 'success' | 'error'>('form');
  const [estimate, setEstimate] = React.useState<{ fee: string; bridgeFee: string; attestationFee: string; feeToken: Token; totalTime: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [txHashes, setTxHashes] = React.useState<Record<string, string>>({});
  const [currentBridgeStep, setCurrentBridgeStep] = React.useState(0);
  const [txHash, setTxHash] = React.useState<string | null>(null);

  const swapChains = () => {
    if (fromChain !== toChain) {
      const temp = fromChain;
      setFromChain(toChain);
      setToChain(temp);
    }
  };

  const handleEstimate = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep('estimate');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isFast = speed === 'FAST';
    setEstimate({
      fee: '0.0001',
      bridgeFee: isFast ? '0.001' : '0.0005',
      attestationFee: isFast ? '0' : '0.0002',
      feeToken: 'USDC',
      totalTime: isFast ? '~2-5 min' : '~15-30 min',
    });
    setStep('confirming');
  };

  const handleBridge = async () => {
    setStep('executing');
    setCurrentBridgeStep(0);
    setTxHashes({});
    
    // Simulate each step
    for (let i = 0; i < bridgeSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, isFast ? 2000 : 3000));
      
      const stepId = bridgeSteps[i].id;
      const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHashes(prev => ({ ...prev, [stepId]: hash }));
      setCurrentBridgeStep(i + 1);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (Math.random() > 0.05) {
      const finalHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(finalHash);
      setStep('success');
      setAmount('');
    } else {
      setError('Bridge failed: Attestation timeout');
      setStep('error');
    }
  };

  const isFast = speed === 'FAST';

  const isFormValid = amount && parseFloat(amount) > 0 && fromChain !== toChain;

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-4">
            <GitBranch className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Bridge USDC</h1>
          <p className="text-gray-400 mt-2">Transfer USDC across chains using Circle CCTP</p>
        </motion.div>

        {/* Form Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Chain Selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                <ChainSelector
                  value={fromChain}
                  onChange={setFromChain}
                  chains={mockChains.map(id => ({ id, name: chainNames[id], nativeToken: 'USDC', supportedTokens: mockTokens, isTestnet: true }))}
                  label="From"
                  testnetOnly={true}
                  disabled={step !== 'form'}
                />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={swapChains}
                  disabled={step !== 'form'}
                  className="self-center"
                  aria-label="Swap chains"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>

                <ChainSelector
                  value={toChain}
                  onChange={setToChain}
                  chains={mockChains.map(id => ({ id, name: chainNames[id], nativeToken: 'USDC', supportedTokens: mockTokens, isTestnet: true }))}
                  label="To"
                  testnetOnly={true}
                  disabled={step !== 'form'}
                />
              </div>

              {/* Token Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-cyan-300 mb-2">From Token</label>
                  <select
                    value={fromToken}
                    onChange={(e) => { setFromToken(e.target.value as Token); if (e.target.value === toToken) setToToken(fromToken); }}
                    disabled={step !== 'form'}
                    className="w-full appearance-none bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
                  >
                    {mockTokens.map(t => (
                      <option key={t} value={t}>{tokenInfo[t].logo} {t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cyan-300 mb-2">To Token</label>
                  <select
                    value={toToken}
                    onChange={(e) => { setToToken(e.target.value as Token); if (e.target.value === fromToken) setFromToken(toToken); }}
                    disabled={step !== 'form'}
                    className="w-full appearance-none bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
                  >
                    {mockTokens.map(t => (
                      <option key={t} value={t}>{tokenInfo[t].logo} {t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <AmountInput
              value={amount}
              onChange={setAmount}
              balance={balance}
              symbol={fromToken}
              decimals={tokenInfo[fromToken].decimals}
              label="Amount"
              placeholder="0.00"
              showMaxButton
              onMaxClick={() => setAmount(balance.replace(/,/g, ''))}
              error={parseFloat(amount) > parseFloat(balance.replace(/,/g, '')) ? 'Insufficient balance' : undefined}
              disabled={step !== 'form'}
            />

            {/* Speed Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-cyan-300">Transfer Speed</label>
              <div className="grid grid-cols-2 gap-3">
                {(['FAST', 'SLOW'] as BridgeSpeed[]).map(s => (
                  <Button
                    key={s}
                    variant={speed === s ? 'default' : 'outline'}
                    onClick={() => setSpeed(s)}
                    disabled={step !== 'form'}
                    className="flex flex-col items-center gap-1 py-4"
                  >
                    <span className="font-medium">{s === 'FAST' ? '⚡' : '🐢'}</span>
                    <span className="text-sm font-medium">{s === 'FAST' ? 'Fast' : 'Slow'}</span>
                    <span className="text-xs text-gray-500">
                      {s === 'FAST' ? '~2-5 min • Higher fee' : '~15-30 min • Lower fee'}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Fee Estimate */}
            <AnimatePresence mode="wait">
              {step === 'estimate' && estimate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FeeBreakdown
                    items={[
                      { label: 'Network Fee', value: estimate.fee, token: estimate.feeToken },
                      { label: 'Bridge Fee', value: estimate.bridgeFee, token: estimate.feeToken },
                      { label: 'Attestation Fee', value: estimate.attestationFee, token: estimate.feeToken },
                    ]}
                    total={parseFloat(amount) + parseFloat(estimate.fee) + parseFloat(estimate.bridgeFee) + parseFloat(estimate.attestationFee)}
                    totalToken={fromToken}
                    title="Bridge Fee Breakdown"
                  />
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm text-cyan-300">Estimated completion: {estimate.totalTime}</span>
                  </div>
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
                    <ArrowLeftRight className="h-4 w-4" />
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
                  <Button onClick={handleBridge} className="flex-1 justify-center gap-2" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Bridging...
                  </Button>
                </motion.div>
              )}

              {step === 'executing' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-white">Bridge Progress</span>
                      <span className="text-sm text-cyan-400">{currentBridgeStep}/{bridgeSteps.length} steps</span>
                    </div>
                    <TxStepper
                      steps={bridgeSteps.map((s, i) => ({
                        ...s,
                        status: i < currentBridgeStep ? 'completed' : i === currentBridgeStep ? 'active' : 'pending',
                        txHash: txHashes[s.id],
                      }))}
                    />
                  </div>
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
                    <span className="font-medium text-green-300">Bridge completed successfully!</span>
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
                    Bridge Again
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
                    <Button variant="outline" onClick={() => { setError(null); setStep('form'); }} className="flex-1">
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
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <GitBranch className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">About CCTP Bridge</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Uses Circle Cross-Chain Transfer Protocol (CCTP)</li>
                  <li>• Native USDC burning & minting (no wrapped tokens)</li>
                  <li>• Fast: ~2-5 min (higher fee) | Slow: ~15-30 min (lower fee)</li>
                  <li>• Attestation service verifies burns before minting</li>
                  <li>• Gas paid in USDC on Arc Network</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}