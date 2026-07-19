'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { Blockchain, SupportedChain } from '@/lib/appkit-types';

interface ChainSelectorProps {
  value: Blockchain;
  onChange: (value: Blockchain) => void;
  chains: SupportedChain[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  testnetOnly?: boolean;
}

const chainLogos: Record<string, string> = {
  'Arc_Testnet': '🔷',
  'Ethereum': '⟠',
  'Base': '🔵',
  'Arbitrum': '🔵',
  'Optimism': '🔴',
  'Polygon': '🟣',
  'Avalanche': '🔺',
  'Solana': '🟢',
};

const chainColors: Record<string, string> = {
  'Arc_Testnet': 'from-cyan-500 to-blue-600',
  'Ethereum': 'from-gray-600 to-gray-800',
  'Base': 'from-blue-500 to-blue-700',
  'Arbitrum': 'from-blue-600 to-blue-800',
  'Optimism': 'from-red-500 to-red-700',
  'Polygon': 'from-purple-600 to-purple-800',
  'Avalanche': 'from-red-600 to-red-800',
  'Solana': 'from-green-500 to-purple-600',
};

export function ChainSelector({ 
  value, 
  onChange, 
  chains, 
  placeholder = 'Select chain',
  label,
  disabled,
  className,
  testnetOnly = true 
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChains = chains.filter(chain => {
    if (testnetOnly && !chain.isTestnet) return false;
    const query = searchQuery.toLowerCase();
    return chain.name.toLowerCase().includes(query) || chain.id.toLowerCase().includes(query);
  });

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-xs font-medium text-cyan-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full appearance-none flex items-center justify-between px-4 py-3 rounded-xl',
            'bg-gray-900/50 border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
            disabled 
              ? 'border-gray-700/50 text-gray-500 cursor-not-allowed' 
              : 'border-gray-700/50 hover:border-cyan-500/30 text-white',
            'disabled:opacity-50'
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
              'bg-gradient-to-br',
              value ? chainColors[value] || 'from-cyan-500 to-blue-600' : 'from-cyan-500/20 to-blue-500/20'
            )} aria-hidden="true">
              {value ? (chainLogos[value] || '🔗') : <Globe className="w-5 h-5 text-gray-500" />}
            </div>
            <div className="min-w-0">
              {value ? (
                <>
                  <span className="block text-white truncate font-medium">
                    {chains.find(c => c.id === value)?.name || value}
                  </span>
                  <span className="block text-xs text-gray-500 truncate">
                    {chains.find(c => c.id === value)?.nativeToken} • {value}
                  </span>
                </>
              ) : (
                <span className="block text-gray-500">{placeholder}</span>
              )}
            </div>
          </div>
          <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 max-h-72"
            >
              <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-3 border-b border-gray-800/50">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chains..."
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto py-2">
                  {filteredChains.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      No chains found
                    </div>
                  ) : (
                    filteredChains.map((chain) => (
                      <button
                        key={chain.id}
                        onClick={() => { onChange(chain.id); setIsOpen(false); }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3',
                          'hover:bg-cyan-500/10 transition-colors',
                          'focus:outline-none focus:bg-cyan-500/10',
                          value === chain.id && 'bg-cyan-500/10'
                        )}
                        role="option"
                        aria-selected={value === chain.id}
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                          'bg-gradient-to-br',
                          chainColors[chain.id] || 'from-gray-600 to-gray-800'
                        )} aria-hidden="true">
                          {chainLogos[chain.id] || '🔗'}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <span className="block text-white truncate font-medium">{chain.name}</span>
                          <span className="block text-xs text-gray-500 truncate">{chain.nativeToken} • {chain.id}</span>
                        </div>
                        {value === chain.id && <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ChainIcon({ chainId, size = 'md', className }: { chainId: Blockchain; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-6 h-6 text-base',
    md: 'w-9 h-9 text-lg',
    lg: 'w-12 h-12 text-xl',
  };

  return (
    <div className={cn(
      'rounded-xl flex items-center justify-center',
      'bg-gradient-to-br',
      chainColors[chainId] || 'from-gray-600 to-gray-800',
      sizes[size],
      className
    )} aria-hidden="true">
      {chainLogos[chainId] || '🔗'}
    </div>
  );
}