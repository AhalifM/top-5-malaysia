'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

export default function HeroScene() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute right-[max(1.5rem,8vw)] top-[18%] hidden h-[28rem] w-[17rem] md:block"
        style={{ perspective: 1100 }}
        animate={reduceMotion ? undefined : { y: [0, -14, 0], rotateZ: [-1, 1.5, -1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 translate-x-8 translate-y-10 rotate-12 rounded-[2rem] bg-gold/10 blur-3xl" />
        <motion.div
          className="relative h-full w-full rounded-[2rem] border border-gold/30 bg-[linear-gradient(145deg,color-mix(in_oklch,var(--surface-2)_70%,black),color-mix(in_oklch,var(--background)_92%,black))] p-3 shadow-[0_40px_120px_color-mix(in_oklch,var(--gold)_18%,transparent)]"
          style={{ transformStyle: 'preserve-3d', rotateX: 9, rotateY: -18 }}
          whileHover={{ rotateY: -13, rotateX: 6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-foreground/15" />
          <div className="relative mt-8 h-[22.5rem] overflow-hidden rounded-[1.35rem] border border-white/10 bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,color-mix(in_oklch,var(--gold)_34%,transparent),transparent_32%),linear-gradient(180deg,transparent_0%,black_88%)]" />
            <div className="absolute left-5 right-5 top-7 grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="aspect-[9/13] rounded-md border border-gold/15 bg-[linear-gradient(160deg,color-mix(in_oklch,var(--gold)_18%,transparent),color-mix(in_oklch,var(--surface)_95%,black))]"
                  animate={reduceMotion ? undefined : { opacity: [0.42, 0.88, 0.42] }}
                  transition={{ duration: 2.6, delay: item * 0.32, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
            <div className="absolute inset-x-5 bottom-6 rounded-xl border border-gold/20 bg-black/55 p-4 backdrop-blur">
              <div className="mb-3 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-gold">
                <Sparkles size={12} />
                Content Engine
              </div>
              <div className="h-2 w-28 rounded-full bg-foreground/75" />
              <div className="mt-2 h-2 w-20 rounded-full bg-foreground/30" />
            </div>
          </div>
          <div className="absolute -left-6 top-24 grid size-14 place-items-center rounded-full border border-gold/25 bg-gold text-primary-foreground shadow-[0_0_45px_color-mix(in_oklch,var(--gold)_35%,transparent)]">
            <Play size={20} fill="currentColor" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
