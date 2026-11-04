import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function AnimatedContent({ children, distance = 25, duration = 0.6, threshold = 0.1, stagger = 0, className = '', style, ...props }) {
  const ref = useRef(null);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: 'visible' });
      if (reduce) return;
      const targets = stagger > 0 ? Array.from(el.children) : [el];
      const tween = gsap.fromTo(targets,
        { y: distance, opacity: 0 },
        { y: 0, opacity: 1, duration, ease: 'power3.out', stagger, paused: true,
          onComplete: () => gsap.set(targets, { clearProps: 'transform' }) });
      ScrollTrigger.create({ trigger: el, start: `top ${(1 - threshold) * 100}%`, once: true, onEnter: () => tween.play() });
    }, el);
    return () => ctx.revert();
  }, [distance, duration, threshold, stagger]);
  return <div ref={ref} className={className} style={{ visibility: 'hidden', ...style }} {...props}>{children}</div>;
}
