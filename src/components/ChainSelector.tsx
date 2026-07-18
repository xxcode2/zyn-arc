'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Globe, ChevronDown, Search } from 'lucide-react';
import { Blockchain } from '@/lib/appkit-types';

interface ChainOption {
  id: Blockchain;
  name: string;
  logo: string;
  nativeToken: string;
  isTestnet: boolean;
  rpcUrl?: string;
  explorerUrl?: string;
}

interface ChainSelectorProps {
  value: Blockchain;
  onChange: (chain: Blockchain) => void;
  options: ChainOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showTestnetBadge?: boolean;
  showSearch?: boolean;
}

const chainLogos: Record<string, string> = {
  ethereum: 'Ξ',
  polygon: '◆',
  avalanche: '▲',
  arbitrum: '◆',
  optimism: '●',
  base: '◆',
  solana: '◎',
  stellar: '★',
  arc_testnet: '◆',
};

const chainColors: Record<string, string> = {
  ethereum: 'from-gray-600 to-gray-800',
  polygon: 'from-purple-600 to-purple-800',
  avalanche: 'from-red-600 to-red-800',
  arbitrum: 'from-blue-600 to-blue-800',
  optimism: 'from-red-500 to-red-700',
  base: 'from-blue-500 to-blue-700',
  solana: 'from-green-500 to-purple-600',
  stellar: 'from-indigo-500 to-blue-500',
  arc_testnet: 'from-cyan-500 to-blue-600',
};

export function ChainSelector({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select chain',
  disabled,
  className,
  showTestnetBadge = true,
  showSearch = true,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.id === value);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const gradientClass = selectedOption ? chainColors[selectedOption.id] : 'from-cyan-500 to-blue-600';

  return (
    <div className={cn('relative w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-xl',
          'bg-gray-900/50 backdrop-blur-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-gray-950',
          disabled 
            ? 'border-gray-700/50 opacity-50 cursor-not-allowed' 
            : 'border border-gray-700/50 hover:border-cyan-500/30'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
            'bg-gradient-to-br',
            gradientClass
          )} aria-hidden="true">
            {selectedOption ? chainLogos[selectedOption.id] || '◆' : <Globe className="w-5 h-5 text-white" />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-white truncate font-medium">
              {selectedOption?.name || placeholder}
            </span>
            {showTestnetBadge && selectedOption?.isTestnet && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Testnet
              </span>
            )}
          </div>
        </div>
        <ChevronDown 
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )} 
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 rounded-2xl bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden"
            role="listbox"
          >
            {showSearch && (
              <div className="p-3 border-b border-gray-700/50 relative">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chains..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-64 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No chains found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={option.id === value}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                      'transition-all duration-150',
                      'hover:bg-gray-800/50',
                      option.id === value && 'bg-cyan-500/10 border border-cyan-500/20'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                      'bg-gradient-to-br',
                      chainColors[option.id] || 'from-gray-600 to-gray-800'
                    )} aria-hidden="true">
                      {chainLogos[option.id] || '◆'}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <span className="block text-white truncate font-medium">{option.name}</span>
                      {showTestnetBadge && option.isTestnet && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                          Testnet
                        </span>
                      )}
                    </div>
                    {option.id === value && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-5 h-5 text-cyan-400 flex items-center justify-center"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      {chainLogos[chainId] || '◆'}
    </div>
  );
}