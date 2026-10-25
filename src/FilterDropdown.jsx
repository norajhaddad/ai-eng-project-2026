import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

export default function FilterDropdown({ label, value, options, onChange, allLabel = 'All', color = 'lavender' }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const optionRefs = useRef([]);
  const listId = React.useId();
  const selectedIndex = Math.max(0, options.indexOf(value));

  function updatePosition() {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 260), window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const flip = below < 200 && above > below;
    setPosition({
      position: 'fixed', left,
      top: flip ? 'auto' : rect.bottom + 8,
      bottom: flip ? window.innerHeight - rect.top + 8 : 'auto',
      width, maxHeight: Math.max(100, (flip ? above : below) - 12),
      overflowY: 'auto', zIndex: 2147483647, boxSizing: 'border-box'
    });
  }
  function openMenu() { setActiveIndex(selectedIndex); updatePosition(); setOpen(true); }
  function closeMenu(restoreFocus = false) { setOpen(false); if (restoreFocus) buttonRef.current?.focus(); }
  function choose(option) { onChange(option); closeMenu(true); }

  useLayoutEffect(() => { if (open) updatePosition(); }, [open]);
  useEffect(() => {
    if (!open) return;
    function outside(event) {
      if (!containerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) closeMenu();
    }
    function escape(event) { if (event.key === 'Escape') closeMenu(true); }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);
  useEffect(() => { if (open) optionRefs.current[activeIndex]?.focus(); }, [open, activeIndex]);

  function handleButtonKeyDown(event) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (!open) openMenu();
    }
  }
  function handleOptionKeyDown(event, index) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index + 1) % options.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index - 1 + options.length) % options.length); }
    else if (event.key === 'Home') { event.preventDefault(); setActiveIndex(0); }
    else if (event.key === 'End') { event.preventDefault(); setActiveIndex(options.length - 1); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(options[index]); }
    else if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    else if (event.key === 'Tab') closeMenu();
  }
  const displayName = option => option === 'All' ? allLabel : option;

  return (
    <div className={`filter-dropdown filter-${color}`} ref={containerRef}>
      <span className="filter-label">{label}</span>
      <button ref={buttonRef} type="button" className={`filter-trigger ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined}
        onClick={() => open ? closeMenu() : openMenu()} onKeyDown={handleButtonKeyDown}>
        <span>{displayName(value)}</span>
        <ChevronDown size={17} className="filter-chevron" />
      </button>
      {open && position && createPortal(
        <div ref={menuRef} id={listId} className={`filter-menu filter-${color} portal-filter-menu`}
          role="listbox" aria-label={label} style={position}>
          {options.map((option, index) => (
            <div key={option} ref={element => { optionRefs.current[index] = element; }}
              role="option" tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={value === option}
              className={`filter-option ${value === option ? 'is-selected' : ''}`}
              onClick={() => choose(option)} onMouseEnter={() => setActiveIndex(index)}
              onKeyDown={event => handleOptionKeyDown(event, index)}>
              <span>{displayName(option)}</span>
              {value === option && <Check size={16} strokeWidth={3} />}
            </div>
          ))}
        </div>, document.body
      )}
    </div>
  );
}
