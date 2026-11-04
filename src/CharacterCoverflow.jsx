import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import './character-coverflow.css';

const MAX_SLOTS = 13;
const ROTATION_MS = 620;

export default function CharacterCoverflow({ characters = [], getCharacterImages }) {
  const count = characters.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [turn, setTurn] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const busyRef = useRef(false);
  const timerRef = useRef(null);
  const pendingRef = useRef(0);
  const ringRef = useRef(null);
  const slots = Math.min(count, MAX_SLOTS);
  const half = Math.floor(slots / 2);
  const stepDegrees = slots ? 360 / slots : 0;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    setActive(current => count ? current % count : 0);
  }, [count]);

  const finishTurn = useCallback(() => {
    if (!busyRef.current) return;
    window.clearTimeout(timerRef.current);
    const delta = pendingRef.current;
    // Disable the transition before resetting the ring to its resting angle.
    if (ringRef.current) {
      ringRef.current.style.transition = 'none';
      ringRef.current.style.transform = 'rotateY(0deg)';
    }
    setTransitioning(false);
    setTurn(0);
    setActive(index => (index + delta + count) % count);
    busyRef.current = false;
    // Restore transitions only after the browser has painted the reset position.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (ringRef.current) {
        ringRef.current.style.transition = '';
        ringRef.current.style.transform = '';
      }
    }));
  }, [count]);

  const move = useCallback(delta => {
    if (!count || busyRef.current || !delta) return;
    const direction = Math.sign(delta);
    if (reducedMotion || slots < 3) {
      setActive(index => (index + direction + count) % count);
      return;
    }
    busyRef.current = true;
    pendingRef.current = direction;
    setTransitioning(true);
    setTurn(-direction * stepDegrees);
    timerRef.current = window.setTimeout(finishTurn, ROTATION_MS + 60);
  }, [count, reducedMotion, slots, stepDegrees, finishTurn]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!count || paused || hovered || focused || reducedMotion) return undefined;
    const interval = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(interval);
  }, [count, paused, hovered, focused, reducedMotion, move]);

  if (!count) return null;

  return (
    <section className="character-coverflow" aria-labelledby="coverflow-heading"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={event => {
        if (event.target.tagName === 'BUTTON') return;
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      }}>
      <div className="character-coverflow-header">
        <div>
          <span className="character-coverflow-eyebrow">CHARACTER SPOTLIGHT</span>
          <h2 id="coverflow-heading">Meet your next teammate</h2>
          <p>Browse the roster for inspiration for your next party.</p>
        </div>
        <button type="button" className="character-coverflow-pause"
          onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
          aria-pressed={paused}>
          {paused ? <Play size={17} /> : <Pause size={17} />}
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
      <div className="character-coverflow-stage">
        <button className="character-coverflow-arrow" type="button" onClick={() => move(-1)} aria-label="Previous character"><ChevronLeft /></button>
        <div className="character-coverflow-track" aria-label="Animatronic carousel">
          <div className="character-coverflow-camera">
            <div ref={ringRef} className={`character-coverflow-ring${transitioning ? ' is-turning' : ''}`}
              style={{ '--ring-turn': `${turn}deg`, '--ring-duration': `${ROTATION_MS}ms` }}>
              {Array.from({ length: slots }, (_, slot) => {
                const offset = slot - half;
                const index = (active + offset + count) % count;
                const character = characters[index];
                const still = getCharacterImages(character)?.still;
                const role = character.fnafWorld?.roles?.map(item => item.label).join(' · ') || '';
                const angle = offset * stepDegrees;
                return (
                  <button type="button" key={slot}
                    className={`character-coverflow-card cursor-target${offset === 0 ? ' is-active' : ''}`}
                    style={{ '--slot-angle': `${angle}deg`, '--face-angle': `${-angle * 0.7}deg`, '--slot-depth': `${Math.cos(angle * Math.PI / 180)}`, zIndex: Math.round(100 + 50 * Math.cos(angle * Math.PI / 180)) }}
                    onClick={() => { if (offset) move(Math.sign(offset)); }}
                    aria-label={`${character.name}${offset === 0 ? ', selected' : ', show character'}`}
                    aria-current={offset === 0 ? 'true' : undefined}
                    tabIndex={offset === 0 ? 0 : -1}>
                    <span className="character-coverflow-art">
                      {still ? <img src={still} alt="" loading="lazy" /> : <span aria-hidden="true">✦</span>}
                    </span>
                    <strong className="cursor-target">{character.name}</strong>
                    {offset === 0 && <small>{role}</small>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <button className="character-coverflow-arrow" type="button" onClick={() => move(1)} aria-label="Next character"><ChevronRight /></button>
      </div>
      <p className="character-coverflow-counter" aria-live="off">{active + 1} / {count} · {characters[active].name}</p>
    </section>
  );
}
