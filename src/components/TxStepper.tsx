'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';

interface BridgeStepData {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  txHash?: string;
  error?: string;
}

interface TxStepperProps {
  steps: BridgeStepData[];
  currentStep?: number;
  className?: string;
}

const stepOrder = ['approve', 'burn', 'attestation', 'mint'];

const stepConfig: Record<string, { icon: string; color: string }> = {
  approve: { icon: '✍️', color: 'text-cyan-400' },
  burn: { icon: '🔥', color: 'text-orange-400' },
  attestation: { icon: '📜', color: 'text-purple-400' },
  mint: { icon: '💚', color: 'text-green-400' },
};

export function TxStepper({ steps, currentStep, className }: TxStepperProps) {
  const sortedSteps = [...steps].sort((a, b) => 
    stepOrder.indexOf(a.id) - stepOrder.indexOf(b.id)
  );

  return (
    <div className={cn('space-y-4', className)}>
      {sortedSteps.map((step, index) => {
        const config = stepConfig[step.id] || { icon: '⬜', color: 'text-gray-400' };
        const isLast = index === sortedSteps.length - 1;
        const isActive = step.status === 'active';
        const isCompleted = step.status === 'completed';
        const isError = step.status === 'error';

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative flex items-start gap-4"
          >
            {!isLast && (
              <motion.div
                className="absolute left-6 top-10 bottom-0 w-0.5"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isCompleted ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{ 
                  background: isCompleted 
                    ? 'linear-gradient(to bottom, #06b6d4, #3b82f6)' 
                    : 'linear-gradient(to bottom, #374151, #1f2937)' 
                }}
              />
            )}

            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center z-10">
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key="pulse"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-xl"
                    style={{ background: config.color.replace('text-', 'bg-').replace('400', '500/30') }}
                  />
                )}
                {isCompleted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-6 h-6 text-green-400"
                  >
                    <Check className="w-6 h-6" />
                  </motion.div>
                ) : isError ? (
                  <motion.div
                    key="error"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-6 h-6 text-red-400"
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : step.status === 'pending' ? (
                  <motion.div
                    key="pending"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 text-gray-500"
                  >
                    <Loader2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <span className="text-2xl">{config.icon}</span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <motion.span
                  key={step.status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'text-sm font-medium',
                    isActive && 'text-cyan-300',
                    isCompleted && 'text-green-300',
                    isError && 'text-red-300',
                    step.status === 'pending' && 'text-gray-500'
                  )}
                >
                  {step.label}
                </motion.span>
                
                {step.txHash && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-400 font-mono">
                    {step.txHash.slice(0, 10)}...
                  </span>
                )}
              </div>
              
              {step.description && (
                <p className="mt-1 text-sm text-gray-500">{step.description}</p>
              )}
              
              {isError && step.error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  {step.error}
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}