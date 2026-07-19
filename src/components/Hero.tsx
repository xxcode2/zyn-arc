'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="px-4 pb-10 pt-6 text-center sm:px-6 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-seal-gold">
          Stablecoin payments on Arc Testnet
        </p>
        <h1 className="mx-auto max-w-xl text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl">
          Send USDC and EURC that settle before the receipt prints.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Connect a wallet, send a payment, and watch it confirm on Arc&rsquo;s
          sub-second finality &mdash; no bridging, no wrapped tokens.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mx-auto mt-9 flex max-w-md items-center justify-between gap-2"
      >
        <Node label="You" />
        <div className="relative h-px flex-1 bg-ink-line">
          {!reduce && (
            <motion.span
              className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-seal-gold shadow-[0_0_8px_2px_rgba(201,162,75,0.6)]"
              animate={{ left: ['0%', '96%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            />
          )}
        </div>
        <div className="flex flex-col items-center gap-1 px-1">
          <Zap className="h-4 w-4 text-seal-gold" />
          <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted">Arc</span>
        </div>
        <div className="relative h-px flex-1 bg-ink-line">
          {!reduce && (
            <motion.span
              className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-seal-green shadow-[0_0_8px_2px_rgba(46,139,99,0.6)]"
              animate={{ left: ['0%', '96%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6, delay: 0.7 }}
            />
          )}
        </div>
        <Node label="Recipient" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mx-auto mt-8 flex max-w-md items-center justify-center gap-1.5 text-xs text-muted"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Gas is paid in USDC &mdash; no separate gas token to hold
      </motion.div>
    </section>
  );
}

function Node({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-2.5 w-2.5 rounded-full border-2 border-paper bg-ink-soft" />
      <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}
