'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Send,
  GitBranch,
  ArrowLeftRight,
  History,
  Wallet,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Send', href: '/send', icon: Send },
  { name: 'Bridge', href: '/bridge', icon: GitBranch },
  { name: 'Swap', href: '/swap', icon: ArrowLeftRight },
  { name: 'History', href: '/history', icon: History },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-gray-900/50 border border-gray-800/50 rounded-xl p-1" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-950 shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800/50 text-white"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <span className="font-medium">Menu</span>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden"
            >
              <nav className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-1" aria-label="Mobile navigation">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-gray-950'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2" aria-label="ArcWay Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl text-white hidden sm:block">ArcWay</span>
            </Link>
            <Navigation />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/50 border border-gray-800/50">
              <span className="text-xs text-gray-400">Testnet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" aria-hidden="true" />
            </div>
            <button className="p-2 rounded-xl bg-gray-900/50 border border-gray-800/50 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all">
              <Wallet className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-gray-950/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Built for Arc Hackathon with <span className="text-red-500">♥</span> using App Kit SDK
          </p>
          <div className="flex items-center gap-6">
            <a href="https://docs.arc.io" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-300 transition-colors">
              Docs
            </a>
            <a href="https://developers.circle.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-300 transition-colors">
              Circle
            </a>
            <a href="https://encode.club" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-cyan-300 transition-colors">
              Encode Club
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pageKey = React.useMemo(() => Math.random().toString(36).slice(2, 9), [children]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}