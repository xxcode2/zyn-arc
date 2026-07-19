'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Send, QrCode, History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { SendPaymentForm } from '@/components/SendPaymentForm';
import { RequestPaymentForm } from '@/components/RequestPaymentForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import { cn } from '@/lib/format';

const TABS = [
  { id: 'send', label: 'Send', icon: Send },
  { id: 'request', label: 'Request', icon: QrCode },
  { id: 'activity', label: 'Activity', icon: History },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function PaymentDashboard() {
  const [active, setActive] = React.useState<TabId>('send');

  return (
    <Card>
      <div className="flex border-b border-paper-line px-2 pt-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'relative flex flex-1 items-center justify-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'text-seal-green' : 'text-ink/45 hover:text-ink/70'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-seal-green"
                />
              )}
            </button>
          );
        })}
      </div>
      <CardContent>
        {active === 'send' && <SendPaymentForm />}
        {active === 'request' && <RequestPaymentForm />}
        {active === 'activity' && <TransactionHistory />}
      </CardContent>
    </Card>
  );
}
