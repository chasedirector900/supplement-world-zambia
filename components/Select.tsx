"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  /** Accessible name — there's no visible <label> in the drawer */
  label: string;
}

/**
 * Themed listbox replacing the native <select>, whose dropdown is drawn by the
 * OS and ignores the dark palette entirely.
 *
 * The panel renders through a portal with fixed positioning: the cart drawer's
 * body is `overflow-y-auto`, which would clip a normally-positioned absolute
 * panel. It flips above the trigger when there isn't room below, and tracks
 * the trigger on scroll/resize.
 *
 * Focus stays on the trigger and the highlighted option is communicated via
 * `aria-activedescendant`, so keyboard support works without moving focus into
 * the portal.
 */
export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  label,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, flip: false });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => setMounted(true), []);

  const reposition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // keep in sync with the option height below (h-12) + panel padding
    const panelH = Math.min(options.length * 48 + 8, 264);
    const spaceBelow = window.innerHeight - r.bottom;
    const flip = spaceBelow < panelH + 8 && r.top > spaceBelow;
    setPos({
      top: flip ? r.top - panelH - 6 : r.bottom + 6,
      left: r.left,
      width: r.width,
      flip,
    });
  }, [options.length]);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    // capture:true so scrolling the drawer body (not just window) repositions
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  // close on outside pointer down
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const openWith = (index: number) => {
    setHighlight(index);
    setOpen(true);
  };

  const commit = (index: number) => {
    onChange(options[index]);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const current = Math.max(0, options.indexOf(value));
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openWith(current);
        else setHighlight((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openWith(current);
        else setHighlight((h) => Math.max(h - 1, 0));
        break;
      case "Home":
        if (open) { e.preventDefault(); setHighlight(0); }
        break;
      case "End":
        if (open) { e.preventDefault(); setHighlight(options.length - 1); }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(highlight);
        else openWith(current);
        break;
      case "Escape":
        if (open) { e.preventDefault(); setOpen(false); }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // keep the highlighted option scrolled into view
  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector(`[data-index="${highlight}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-opt-${highlight}` : undefined}
        aria-label={label}
        onClick={() => (open ? setOpen(false) : openWith(Math.max(0, options.indexOf(value))))}
        onKeyDown={onKeyDown}
        className={`flex h-12 w-full items-center justify-between gap-2 rounded-lg border bg-charcoal px-3 text-left text-base transition sm:text-sm ${
          open ? "border-brand" : "border-border hover:border-brand/60"
        } ${value ? "text-ink" : "text-muted"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={panelRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="scrollbar-slim fixed z-50 max-h-64 overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-card animate-fadeIn"
          >
            {options.map((option, i) => {
              const selected = option === value;
              return (
                <div
                  key={option}
                  id={`${id}-opt-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => commit(i)}
                  className={`flex h-12 cursor-pointer items-center justify-between gap-2 rounded-lg px-3 text-sm transition ${
                    i === highlight ? "bg-brand/15 text-ink" : "text-muted"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {selected && <Check size={15} className="shrink-0 text-brand" />}
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
