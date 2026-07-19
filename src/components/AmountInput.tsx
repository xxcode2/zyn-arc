'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Plus, Maximize2, CheckCircle, AlertCircle } from 'lucide-react';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  balance?: string;
  symbol?: string;
  decimals?: number;
  maxDecimals?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  showMaxButton?: boolean;
  onMaxClick?: () => void;
}

export function AmountInput({
  value,
  onChange,
  balance,
  symbol = 'USDC',
  decimals = 6,
  maxDecimals = 6,
  placeholder = '0.00',
  disabled,
  error,
  label,
  showMaxButton = true,
  onMaxClick,
}: AmountInputProps) {
  void decimals;
  const [localValue, setLocalValue] = React.useState(value);
  const [focused, setFocused] = React.useState(false);
  const [showCopied] = React.useState(false);

  React.useEffect(() => {
    if (!focused) setLocalValue(value);
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue === '') {
      setLocalValue('');
      onChange('');
      return;
    }

    const regex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);
    if (regex.test(newValue)) {
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  const handleMaxClick = () => {
    if (balance && onMaxClick) {
      onMaxClick();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (/^\d*\.?\d*$/.test(text)) {
      e.preventDefault();
      const newValue = text.slice(0, maxDecimals + (text.includes('.') ? 1 : 0));
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  const balanceNum = balance ? parseFloat(balance) : 0;
  const valueNum = localValue ? parseFloat(localValue) : 0;
  const isMaxed = balance && Math.abs(valueNum - balanceNum) < 0.000001;
  const hasError = !!error;
  const isOverBalance = balance && valueNum > balanceNum;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-cyan-300">{label}</label>
          {balance && (
            <span className="text-xs text-gray-500 font-mono">
              Balance: {parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {symbol}
            </span>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={localValue || ''}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              'w-full appearance-none bg-gray-900/50 border rounded-xl px-4 py-4 pr-24 text-white text-lg font-mono',
              'placeholder:text-gray-600',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
              disabled && 'opacity-50 cursor-not-allowed',
              hasError && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50',
              isOverBalance && !hasError && 'border-amber-500/50 focus:ring-amber-500/50 focus:border-amber-500/50',
              (!hasError && !isOverBalance) && 'border-gray-700/50 hover:border-gray-600/50',
              'rounded-xl'
            )}
            aria-invalid={hasError || isOverBalance ? true : undefined}
            aria-describedby={hasError ? 'amount-error' : isOverBalance ? 'amount-warning' : undefined}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showMaxButton && balance && !disabled && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMaxClick}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                  isMaxed 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 border border-gray-700/50'
                )}
                aria-label="Max amount"
              >
                {isMaxed ? <CheckCircle className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </motion.button>
            )}
            <span className={cn('text-sm text-gray-500 px-1', focused && 'text-cyan-400')}>
              {symbol}
            </span>
          </div>
        </div>

        {hasError && (
          <motion.p
            id="amount-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {error}
          </motion.p>
        )}

        {isOverBalance && !hasError && (
          <motion.p
            id="amount-warning"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-amber-400 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            Insufficient balance
          </motion.p>
        )}

        {showCopied && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs rounded-lg flex items-center gap-1 whitespace-nowrap shadow-lg"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Copied to clipboard
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {focused && balance && !isMaxed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={handleMaxClick}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50 hover:border-gray-600/50 hover:text-gray-300 transition-all text-sm"
          >
            <span className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Use max balance
            </span>
            <span className="font-mono text-white bg-gray-900/50 px-2 py-0.5 rounded">
              {parseFloat(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {symbol}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}