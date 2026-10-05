import { useLayoutEffect, useRef, type ReactElement } from 'react';

const FIELD_SELECTOR = 'label, input, textarea, select, [contenteditable="true"]';
const WIDE_SELECTOR = 'textarea, [contenteditable="true"]';

// Finds the element Launchpad uses to stack the card's fields: the first element (breadth-first)
// with at least two children that each contain a field
function findFieldContainer(root: HTMLElement): HTMLElement | null {
  const queue: Element[] = [root];
  while (queue.length > 0) {
    const el = queue.shift() as HTMLElement;
    const fieldKids = Array.from(el.children).filter(kid => kid.querySelector(FIELD_SELECTOR));
    if (fieldKids.length >= 2) return el;
    queue.push(...Array.from(el.children));
  }
  return null;
}

interface LaunchpadFieldsProps {
  child: ReactElement<any>;
  columns: number;
  // When false, long text fields fill one column like the others (a plain N × N grid)
  wideText: boolean;
}

// Renders the card exactly as Launchpad does (so every input stays editable, validated and wired
// to its data), then lays the rendered fields out in columns with CSS classes. Long text inputs
// (text areas, rich text) span the full width.
export default function LaunchpadFields({ child, columns, wideText }: LaunchpadFieldsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || columns < 2) return;
    const container = findFieldContainer(root);
    if (!container) return;
    container.classList.add('sc-lp-grid');
    container.style.setProperty('--sc-cols', String(columns));
    Array.from(container.children).forEach(kid => {
      kid.classList.toggle('sc-lp-wide', wideText && Boolean(kid.querySelector(WIDE_SELECTOR)));
    });
  });

  return (
    <div ref={ref} className='sc-launchpad'>
      {child}
    </div>
  );
}
