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
import { Send, Loader2, CheckCircle, AlertCircle, Copy, QrCode } from 'lucide-react';

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
  solana: 'Solana',
  stellar: 'Stellar',
};

const tokenInfo: Record<Token, { decimals: number; logo: string }> = {
  USDC: { decimals: 6, logo: '💲' },
  USDT: { decimals: 6, logo: '💲' },
  EURC: { decimals: 6, logo: '💶' },
};

export default function SendPage() {
  const [chain, setChain] = React.useState<Blockchain>('arc_testnet');
  const [token, setToken] = React.useState<Token>('USDC');
  const [amount, setAmount] = React.useState('');
  const [balance] = React.useState('50,000.00');
  const [recipient, setRecipient] = React.useState('');
  const [step, setStep] = React.useState<'form' | 'estimate' | 'confirming' | 'success' | 'error'>('form');
  const [estimate, setEstimate] = React.useState<{ gasFee: string; totalFee: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [txHash, setTxHash] = React.useState<string | null>(null);

  const handleEstimate = async () => {
    if (!amount || !recipient) return;
    setStep('estimate');
    await new Promise(resolve => setTimeout(resolve, 800));
    setEstimate({ gasFee: '0.0001', totalFee: '0.0001' });
    setStep('confirming');
  };

  const handleSend = async () => {
    setStep('confirming');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() > 0.05) {
      const hash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(hash);
      setStep('success');
      setAmount('');
      setRecipient('');
    } else {
      setError('Transaction failed: Insufficient gas');
      setStep('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep('form');
  };

  const isFormValid = amount && recipient && parseFloat(amount) > 0 && recipient.startsWith('0x');

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 mb-4">
            <Send className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Send USDC</h1>
          <p className="text-gray-400 mt-2">Transfer to any address on the same chain</p>
        </motion.div>

        {/* Form Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Chain Selection */}
            <ChainSelector
              value={chain}
              onChange={setChain}
              chains={mockChains.map((id) => ({ id, name: chainNames[id], logo: chainNames[id], nativeToken: 'USDC', supportedTokens: mockTokens, isTestnet: true }))}
              label="Network"
              testnetOnly={true}
              disabled={step !== 'form'}
            />

            {/* Token Selection */}
            <div>
              <label className="block text-xs font-medium text-cyan-300 mb-2">Token</label>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value as Token)}
                disabled={step !== 'form'}
                className="w-full appearance-none bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
              >
                {mockTokens.map(t => (
                  <option key={t} value={t}>{tokenInfo[t].logo} {t}</option>
                ))}
              </select>
            </div>

            {/* Recipient Address */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-cyan-300">Recipient Address</label>
              <div className="relative">
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  disabled={step !== 'form'}
                  className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 pr-32 text-white font-mono placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { }} aria-label="Scan QR code">
                    <QrCode className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { }} aria-label="Paste from clipboard">
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {recipient && !recipient.startsWith('0x') && (
                <p className="text-xs text-red-400">Address must start with 0x</p>
              )}
            </div>

            {/* Amount Input */}
            <AmountInput
              value={amount}
              onChange={setAmount}
              balance={balance}
              symbol={token}
              decimals={tokenInfo[token].decimals}
              label="Amount"
              placeholder="0.00"
              showMaxButton
              onMaxClick={() => setAmount(balance.replace(/,/g, ''))}
              error={parseFloat(amount) > parseFloat(balance.replace(/,/g, '')) ? 'Insufficient balance' : undefined}
              disabled={step !== 'form'}
            />

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
                      { label: 'Gas Fee', value: estimate.gasFee, token: token },
                    ]}
                    total={parseFloat(amount) + parseFloat(estimate.totalFee)}
                    totalToken={token}
                    title="Transaction Fee"
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
                    <Send className="h-4 w-4" />
                    Review & Send
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
                  <Button onClick={handleSend} className="flex-1 justify-center gap-2" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
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
                    <span className="font-medium text-green-300">Transaction sent successfully!</span>
                  </div>
                  {txHash && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-900/50 border border-gray-700/50 font-mono text-sm text-gray-300">
                      <span className="flex-1 truncate">{txHash}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(txHash)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => setStep('form')} className="w-full">
                    Send Again
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
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Send className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">About Sending</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Transfers on the same chain (no bridging)</li>
                  <li>• Gas paid in USDC on Arc Network</li>
                  <li>• Sub-second finality on Arc Testnet</li>
                  <li>• Send to any EVM-compatible address</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}