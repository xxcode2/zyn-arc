'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Minus, Max, Copy, Check } from 'lucide-react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  symbol?: string;
  balance?: string;
  maxButtonLabel?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  symbol = 'USDC',
  balance,
  maxButtonLabel = 'Max',
  placeholder = '0.00',
  error,
  disabled,
  className,
}: AmountInputProps) {
  const [showMax, setShowMax] = React.useState(false);
  const numericValue = parseFloat(value) || 0;
  const numericBalance = parseFloat(balance || '0') || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleMax = () => {
    if (balance) {
      onChange(balance);
      setShowMax(true);
      setTimeout(() => setShowMax(false), 2000);
    }
  };

  const handleIncrement = (amount: number) => {
    const newValue = Math.max(0, numericValue + amount);
    onChange(newValue.toFixed(2));
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <span className="text-lg font-mono">${symbol}</span>
        </div>
        <Input
          type="text"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          error={error}
          disabled={disabled}
          className="pl-12 pr-16 text-right font-mono text-lg"
          inputMode="decimal"
          autoComplete="off"
        />
        {showMax && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-16 top-1/2 -translate-y-1/2"
          >
            <span className="px-2 py-0.5 text-xs font-medium text-green-400 bg-green-500/10 rounded-full border border-green-500/30">
              Max
            </span>
          </motion.div>
        )}
      </div>

      {balance && numericBalance > 0 && (
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleIncrement(-0.01)}
              disabled={disabled || numericValue <= 0}
              className="h-9 w-9 p-0"
              aria-label="Decrease by 0.01"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleIncrement(0.01)}
              disabled={disabled || numericValue >= numericBalance}
              className="h-9 w-9 p-0"
              aria-label="Increase by 0.01"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMax}
              disabled={disabled || numericValue >= numericBalance}
              className="flex-1 ml-2"
            >
              <Max className="h-4 w-4 mr-1.5" />
              {maxButtonLabel}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Available: <span className="text-cyan-300 font-mono">{parseFloat(balance).toLocaleString()}</span> {symbol}
          </p>
        </div>
      )}

      {error && !balance && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}