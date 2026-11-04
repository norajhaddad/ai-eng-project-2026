import React from 'react';

/**
 * Lightweight AnimatedList-inspired item helper.
 * Applies a staggered entrance to existing list items without changing
 * their markup, keyboard controls, or accessibility roles.
 */
export function animatedListItemStyle(index) {
  return { '--animated-list-delay': `${Math.min(index, 12) * 45}ms` };
}

export default function AnimatedList({ children, className = '' }) {
  return <div className={`animated-list-surface ${className}`.trim()}>{children}</div>;
}
