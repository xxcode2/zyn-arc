'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

interface FeeItem {
  label: string;
  value: string;
  token: string;
  type?: 'fee' | 'gas' | 'bridge' | 'swap' | 'total';
}

interface FeeBreakdownProps {
  items: FeeItem[];
  isLoading?: boolean;
  className?: string;
  title?: string;
  showTotal?: boolean;
  total?: number;
  totalToken?: string;
}

const typeStyles: Record<string, { icon: string; color: string }> = {
  fee: { icon: '💸', color: 'text-cyan-300' },
  gas: { icon: '⛽', color: 'text-orange-300' },
  bridge: { icon: '🌉', color: 'text-purple-300' },
  swap: { icon: '🔄', color: 'text-green-300' },
  total: { icon: '💰', color: 'text-white font-bold' },
};

export function FeeBreakdown({ 
  items, 
  isLoading, 
  className, 
  title = 'Fee Breakdown',
  showTotal = true,
  total,
  totalToken,
}: FeeBreakdownProps) {
  const totalFees = items
    .filter(f => f.type !== 'total')
    .reduce((sum, fee) => sum + parseFloat(fee.value), 0);

  const displayItems = showTotal 
    ? [...items, { label: 'Total', value: (typeof total === 'number' ? total : totalFees).toFixed(6), token: totalToken || items[0]?.token || 'USDC', type: 'total' as const }]
    : items;

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between h-8">
                <div className="w-1/3 bg-gray-800/50 rounded animate-pulse" />
                <div className="w-1/4 bg-gray-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5">
        <h4 className="text-sm font-medium text-cyan-300 mb-4 uppercase tracking-wider">{title}</h4>
        <div className="space-y-3">
          {displayItems.map((fee, index) => {
            const style = typeStyles[fee.type || 'fee'];
            const isTotal = fee.type === 'total';
            
            return (
              <motion.div
                key={`${fee.label}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={cn(
                  'flex items-center justify-between py-2',
                  isTotal && 'border-t border-gray-800/50 pt-3 mt-1'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg" aria-hidden="true">{style.icon}</span>
                  <span className={cn('text-sm', isTotal && 'font-semibold', style.color)}>
                    {fee.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className={cn('font-mono text-sm', isTotal && 'font-bold text-lg', style.color)}>
                    {parseFloat(fee.value).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
                  </span>
                  <span className={cn('text-xs text-gray-500', isTotal && 'text-gray-400')}>
                    {fee.token}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface EstimateCardProps {
  title: string;
  value: string;
  token: string;
  fee?: string;
  feeToken?: string;
  isLoading?: boolean;
  className?: string;
}

export function EstimateCard({ title, value, token, fee, feeToken, isLoading, className }: EstimateCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('p-4', className)}>
        <div className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-800/50 rounded animate-pulse" />
          <div className="h-8 w-1/2 bg-gray-800/50 rounded animate-pulse" />
          {fee && <div className="h-4 w-1/3 bg-gray-800/50 rounded animate-pulse" />}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('p-4', className)}>
      <p className="text-xs font-medium text-cyan-300 uppercase tracking-wider mb-1">{title}</p>
      <div className="font-mono text-2xl font-bold text-white mb-1">
        {parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        <span className="text-sm font-normal text-gray-400 ml-1">{token}</span>
      </div>
      {fee && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="text-orange-400">≈</span>
          <span className="font-mono text-orange-300">{parseFloat(fee).toLocaleString()}</span>
          <span>{feeToken}</span>
          <span className="text-gray-500">fee</span>
        </p>
      )}
    </Card>
  );
}