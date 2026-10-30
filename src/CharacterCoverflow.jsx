import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import './character-coverflow.css';

export default function CharacterCoverflow({ characters, getCharacterImages }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const count = characters.length;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!count || paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [count, paused, hovered, focused, reducedMotion]);

  if (!count) return null;
  const move = (step) => setActive(index => (index + step + count) % count);
  // Thirteen equally spaced positions on one circular path, including its rear arc.
  // Use the same geometry at every step so cards cannot bunch up unpredictably.
  const slots = Math.min(count, 13);
  const half = Math.floor(slots / 2);
  const visible = Array.from({ length: slots }, (_, i) => i - half);
  const stepAngle = (2 * Math.PI) / slots;
  const radius = 355;

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
        <div><span className="character-coverflow-eyebrow">CHARACTER SPOTLIGHT</span>
          <h2 id="coverflow-heading">Meet your next teammate</h2>
          <p>Browse the roster for inspiration for your next party.</p></div>
        <button type="button" className="character-coverflow-pause"
          onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
          aria-pressed={paused}>
          {paused ? <Play size={17} /> : <Pause size={17} />}
          {paused ? 'Play' : 'Pause'}
        </button>
      </div>
      <div className="character-coverflow-stage" aria-label="Animatronic carousel">
        <button className="character-coverflow-arrow" type="button" onClick={() => move(-1)} aria-label="Previous character"><ChevronLeft /></button>
        <div className="character-coverflow-track">
          {visible.map(offset => {
            const index = (active + offset + count) % count;
            const character = characters[index];
            const still = getCharacterImages(character)?.still;
            const role = character.fnafWorld?.roles?.map(item => item.label).join(' · ') || '';
            return (
              <button type="button" key={character.id} className={`character-coverflow-card ${offset === 0 ? 'is-active' : ''}`}
                style={(() => {
                  const angle = offset * stepAngle;
                  const depth = radius * (Math.cos(angle) - 1);
                  const x = radius * Math.sin(angle);
                  // Rear cards are raised slightly so the back of the ring stays visible.
                  const y = -36 * (1 - Math.cos(angle));
                  // Smoothly turn cards toward the center at the sides and
                  // back toward the viewer on the rear arc. No abrupt flip.
                  const facing = Math.sin(angle) * (Math.PI * 0.43);
                  return {
                    '--ring-x': `${x.toFixed(2)}px`,
                    '--ring-y': `${y.toFixed(2)}px`,
                    '--ring-z': `${depth.toFixed(2)}px`,
                    '--ring-angle': `${(facing * 180 / Math.PI).toFixed(2)}deg`,
                    zIndex: Math.round(1000 + depth),
                  };
                })()}
                onClick={() => offset && move(offset)}
                aria-label={`${character.name}${offset === 0 ? ', selected' : ', show character'}`}
                aria-current={offset === 0 ? 'true' : undefined}
                tabIndex={offset === 0 ? 0 : -1}>
                <span className="character-coverflow-art">{still ? <img src={still} alt="" loading="lazy" /> : <span aria-hidden="true">✦</span>}</span>
                <strong>{character.name}</strong>
                {offset === 0 && <small>{role}</small>}
              </button>
            );
          })}
        </div>
        <button className="character-coverflow-arrow" type="button" onClick={() => move(1)} aria-label="Next character"><ChevronRight /></button>
      </div>
      <p className="character-coverflow-counter" aria-live="off">{active + 1} / {count} · {characters[active].name}</p>
    </section>
  );
}
