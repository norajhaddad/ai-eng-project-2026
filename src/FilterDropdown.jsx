
import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Check,
  ChevronDown
} from 'lucide-react';

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  allLabel = 'All',
  color = 'lavender'
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);
  const listId = React.useId();

  const selectedIndex = Math.max(
    0,
    options.indexOf(value)
  );

  function openMenu() {
    setActiveIndex(selectedIndex);
    setOpen(true);
  }

  function closeMenu(restoreFocus = false) {
    setOpen(false);

    if (restoreFocus) {
      buttonRef.current?.focus();
    }
  }

  function choose(option) {
    onChange(option);
    closeMenu(true);
  }

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener(
      'pointerdown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleOutsideClick
      );
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [open, activeIndex]);

  function handleButtonKeyDown(event) {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();

      if (!open) {
        openMenu();
      }
    }
  }

  function handleOptionKeyDown(event, index) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index + 1) % options.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (index - 1 + options.length) % options.length
      );
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(options[index]);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    }

    if (event.key === 'Tab') {
      closeMenu();
    }
  }

  function displayName(option) {
    return option === 'All' ? allLabel : option;
  }

  return (
    <div
      className={`filter-dropdown filter-${color}`}
      ref={containerRef}
    >
      <span className="filter-label">
        {label}
      </span>

      <button
        ref={buttonRef}
        type="button"
        className={`filter-trigger ${
          open ? 'is-open' : ''
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleButtonKeyDown}
      >
        <span>{displayName(value)}</span>

        <ChevronDown
          size={17}
          className="filter-chevron"
        />
      </button>

      {open && (
        <div
          id={listId}
          className="filter-menu"
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => (
            <div
              key={option}
              ref={element => {
                optionRefs.current[index] = element;
              }}
              role="option"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={value === option}
              className={`filter-option ${
                value === option ? 'is-selected' : ''
              }`}
              onClick={() => choose(option)}
              onMouseEnter={() => setActiveIndex(index)}
              onKeyDown={event =>
                handleOptionKeyDown(event, index)
              }
            >
              <span>{displayName(option)}</span>

              {value === option && (
                <Check size={16} strokeWidth={3} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
