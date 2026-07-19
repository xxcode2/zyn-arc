'use client';

import { ReactNode } from 'react';
import { AppKitProvider } from '@/hooks/useAppKit';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppKitProvider>
      {children}
    </AppKitProvider>
  );
}