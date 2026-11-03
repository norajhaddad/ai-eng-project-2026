import React, { useEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

/**
 * Animated character wall. renderItem must return a single focusable card/link.
 * Duplicate animation tiles are excluded from keyboard and screen-reader navigation.
 */
export default function DriftWall({
  items = [],
  renderItem,
  columns = 5,
  tileWidth = 180,
  tileHeight = 220,
  gap = 18,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 34,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0.6,
  pauseOnHover = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const trackRefs = useRef([]);
  const offsetsRef = useRef([]);
  const lastFrameRef = useRef(null);
  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);
  const [height, setHeight] = useState(600);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const columnItems = useMemo(() => {
    const count = Math.max(1, Math.min(columns, items.length || 1));
    const groups = Array.from({ length: count }, () => []);
    items.forEach((item, index) => groups[index % count].push({ item, index }));
    return groups;
  }, [items, columns]);

  const metrics = useMemo(() => columnItems.map(group => {
    const step = tileHeight + gap;
    const cycleHeight = group.length * step;
    const copies = Math.max(2, Math.ceil((height * 1.8) / Math.max(cycleHeight, 1)) + 2);
    return { cycleHeight, copies };
  }), [columnItems, tileHeight, gap, height]);

  useEffect(() => {
    offsetsRef.current = metrics.map(() => 0);
    trackRefs.current.forEach(track => {
      if (track) track.style.transform = 'translate3d(0, 0, 0)';
    });
    lastFrameRef.current = null;
  }, [metrics]);

  useEffect(() => {
    if (reducedMotion || !items.length) return undefined;
    let frame;
    const animate = time => {
      const previous = lastFrameRef.current;
      lastFrameRef.current = time;
      const dt = previous == null ? 0 : Math.min((time - previous) / 1000, 0.05);
      const paused = (pauseOnHover && hoveringRef.current) || focusedRef.current || document.hidden;
      if (!paused) {
        metrics.forEach(({ cycleHeight }, index) => {
          if (!cycleHeight) return;
          const columnDirection = (index % 2 === 0 ? 1 : -1) * (direction === 'down' ? -1 : 1);
          const columnSpeed = speed * (1 + ((index % 3) - 1) * variance);
          let next = offsetsRef.current[index] + dt * columnSpeed * columnDirection;
          next = ((next % cycleHeight) + cycleHeight) % cycleHeight;
          offsetsRef.current[index] = next;
          const track = trackRefs.current[index];
          if (track) {
            // For reverse columns, start one cycle higher to avoid empty space.
            const y = columnDirection > 0 ? -next : next - cycleHeight;
            track.style.transform = `translate3d(0, ${y}px, 0)`;
          }
        });
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      lastFrameRef.current = null;
    };
  }, [metrics, speed, variance, direction, pauseOnHover, reducedMotion, items.length]);

  const handlePointerMove = event => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    containerRef.current.style.setProperty('--dw-pointer-x', `${x * parallax * 12}deg`);
    containerRef.current.style.setProperty('--dw-pointer-y', `${-y * parallax * 12}deg`);
  };

  if (!items.length) return null;

  return (
    <div
      ref={containerRef}
      className={`drift-wall ${className}`.trim()}
      role="group"
      aria-label="Animated character directory"
      onPointerEnter={() => { hoveringRef.current = true; }}
      onPointerLeave={() => {
        hoveringRef.current = false;
        containerRef.current?.style.setProperty('--dw-pointer-x', '0deg');
        containerRef.current?.style.setProperty('--dw-pointer-y', '0deg');
      }}
      onPointerMove={handlePointerMove}
      onFocusCapture={() => { focusedRef.current = true; }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) focusedRef.current = false;
      }}
      style={{
        '--dw-tile-width': `${tileWidth}px`,
        '--dw-tile-height': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-tilt': `${tilt}deg`,
        '--dw-turn': `${turn}deg`,
        '--dw-roll': `${roll}deg`,
        '--dw-perspective': `${perspective}px`,
        '--dw-depth': `${depth}px`,
        '--dw-lift': `${lift}px`,
        '--dw-fade': fade,
      }}
    >
      <div className="drift-wall__plane">
        {columnItems.map((group, columnIndex) => (
          <div className="drift-wall__column" key={columnIndex}>
            <div className="drift-wall__track" ref={node => { trackRefs.current[columnIndex] = node; }}>
              {Array.from({ length: metrics[columnIndex].copies }, (_, copyIndex) => (
                <div
                  className="drift-wall__cycle"
                  key={copyIndex}
                  aria-hidden={copyIndex !== ((columnIndex % 2 === 0 ? 1 : -1) * (direction === 'down' ? -1 : 1) > 0 ? 0 : 1) ? 'true' : undefined}
                  inert={copyIndex !== ((columnIndex % 2 === 0 ? 1 : -1) * (direction === 'down' ? -1 : 1) > 0 ? 0 : 1) ? true : undefined}
                >
                  {group.map(({ item, index }) => (
                    <div className="drift-wall__tile" key={`${copyIndex}-${item.id ?? index}`}>
                      {renderItem(item, index)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
