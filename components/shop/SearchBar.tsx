"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  /** False when nothing is filtered — the count is withheld rather than
   *  announcing the shop's whole stock level. Mirrors the visible counter. */
  announceCount: boolean;
}

/**
 * The input is locally controlled and debounced into the URL, so typing never
 * waits on a router round-trip. It re-syncs from `value` when the change came
 * from somewhere else (back button, a suggestion chip, "clear search").
 */
export default function SearchBar({
  value,
  onChange,
  resultCount,
  announceCount,
}: SearchBarProps) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const dirty = useRef(false);

  // adopt external changes, but never clobber what the user is mid-way through typing
  useEffect(() => {
    if (!dirty.current) setText(value);
  }, [value]);

  useEffect(() => {
    if (text === value) return;
    const id = setTimeout(() => {
      dirty.current = false;
      onChange(text);
    }, 220);
    return () => clearTimeout(id);
  }, [text, value, onChange]);

  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        value={text}
        onChange={(e) => {
          dirty.current = true;
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && text) {
            dirty.current = false;
            setText("");
            onChange("");
          }
        }}
        placeholder="Search whey, creatine, pre-workout, a brand…"
        aria-label="Search products"
        aria-describedby="search-result-count"
        className="h-14 w-full rounded-2xl border border-border bg-surface pl-12 pr-12 text-base text-ink placeholder:text-muted focus:border-brand focus:outline-none"
      />
      {text && (
        <button
          onClick={() => {
            dirty.current = false;
            setText("");
            onChange("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-xl text-muted transition hover:text-ink"
        >
          <X size={18} />
        </button>
      )}
      {/* announced to screen readers as results change */}
      <p id="search-result-count" className="sr-only" aria-live="polite">
        {announceCount
          ? `${resultCount} ${resultCount === 1 ? "product" : "products"} found`
          : "Showing the full range"}
      </p>
    </div>
  );
}
