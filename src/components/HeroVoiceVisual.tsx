import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

const BAR_DELAYS = [0, 0.1, 0.05, 0.15, 0.08, 0.12, 0.03, 0.14, 0.07, 0.11, 0.06, 0.09];

export type HeroVoiceVisualProps = {
  typingSegments: readonly string[];
  panelLabel: string;
  footerHint: string;
};

export const HeroVoiceVisual: React.FC<HeroVoiceVisualProps> = ({
  typingSegments,
  panelLabel,
  footerHint,
}) => {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const fullLine = useMemo(() => typingSegments.join(''), [typingSegments]);

  useEffect(() => {
    setSegmentIndex(0);
    setCharIndex(0);
  }, [typingSegments]);

  useEffect(() => {
    const segment = typingSegments[segmentIndex];
    if (!segment) return;

    if (charIndex < segment.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), 42);
      return () => window.clearTimeout(t);
    }

    const nextSeg = segmentIndex + 1;
    if (nextSeg < typingSegments.length) {
      const t = window.setTimeout(() => {
        setSegmentIndex(nextSeg);
        setCharIndex(0);
      }, 120);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setSegmentIndex(0);
      setCharIndex(0);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [segmentIndex, charIndex, typingSegments]);

  let rendered = '';
  for (let s = 0; s < segmentIndex; s++) {
    rendered += typingSegments[s];
  }
  if (segmentIndex < typingSegments.length) {
    rendered += typingSegments[segmentIndex].slice(0, charIndex);
  }

  const cursorVisible =
    segmentIndex < typingSegments.length &&
    charIndex < typingSegments[segmentIndex].length;

  return (
    <div className="mt-14 md:mt-16 max-w-2xl mx-auto" aria-hidden="true">
      <div className="rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/90 shadow-xl shadow-zinc-200/50 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col items-center gap-8">
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-zinc-900/10"
              animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg">
              <Mic size={28} strokeWidth={2} aria-hidden />
            </div>
          </div>

          <div className="flex h-12 w-full max-w-xs items-end justify-center gap-[5px] md:gap-1.5">
            {BAR_DELAYS.map((delay, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-full bg-zinc-900 md:w-2"
                initial={{ height: 10 }}
                animate={{ height: [10, 28 + (i % 4) * 6, 10] }}
                transition={{
                  duration: 0.55 + (i % 5) * 0.06,
                  repeat: Infinity,
                  delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="w-full rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-left shadow-inner shadow-zinc-100/80">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              {panelLabel}
            </p>
            <p className="min-h-[3.25rem] font-mono text-sm leading-relaxed text-zinc-700 md:text-base md:leading-relaxed">
              {rendered}
              <motion.span
                className="inline-block w-0.5 h-[1.1em] translate-y-0.5 bg-zinc-900 align-middle ml-0.5"
                animate={{ opacity: cursorVisible ? [1, 0.2, 1] : [1, 0.3, 1] }}
                transition={{ duration: 0.55, repeat: Infinity }}
              />
            </p>
            <p className="mt-2 text-xs text-zinc-400 truncate" title={fullLine}>
              {footerHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
