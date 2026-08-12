/**
 * Stand-in artwork for products that don't have a real photo yet.
 *
 * Deterministic: the same product always renders the same gradient, so the
 * grid doesn't reshuffle between renders or between server and client. Hues
 * stay inside a narrow band around the brand green (#70B21D ≈ hsl(85 72% 41%))
 * so a wall of these still reads as one palette rather than confetti.
 *
 * Swap in a real photo by setting `image` on the product — ProductCard prefers
 * it automatically and this component stops being used for that item.
 */

interface ProductPlaceholderProps {
  /** Product name — drawn as the label */
  name: string;
  /** Stable id, used as the variation seed */
  seed: string;
  /** Dropped from the label when it prefixes the name, to keep it short */
  brand?: string;
  /** Hide from screen readers where the product name is already right beside it */
  decorative?: boolean;
}

/** Small deterministic string hash (djb2-ish), always non-negative. */
function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Greedy wrap into at most `maxLines` lines of roughly `perLine` characters. */
function wrap(text: string, perLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    // start a new line only while we still have one to spare
    if (line && candidate.length > perLine && lines.length < maxLines - 1) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function ProductPlaceholder({
  name,
  seed,
  brand,
  decorative = false,
}: ProductPlaceholderProps) {
  const h = hash(seed);

  // narrow green band so the whole grid stays on-palette
  const hue = 78 + (h % 18); // 78–95
  const sat = 42 + ((h >> 3) % 30); // 42–71
  // ceiling kept low so the watermark label never washes out on the brightest
  // variants — measured, not guessed
  const light = 14 + ((h >> 7) % 13); // 14–26
  const angle = [135, 155, 115, 170][(h >> 11) % 4];

  const from = `hsl(${hue} 26% 6%)`;
  const to = `hsl(${hue} ${sat}% ${light}%)`;

  // circle placement varies but always stays clear of the centred label
  const c1 = { cx: 22 + ((h >> 2) % 16), cy: 20 + ((h >> 5) % 14), r: 15 + ((h >> 9) % 8) };
  const c2 = { cx: 68 + ((h >> 4) % 20), cy: 16 + ((h >> 6) % 16), r: 9 + ((h >> 8) % 7) };
  const c3 = { cx: 14 + ((h >> 6) % 24), cy: 74 + ((h >> 3) % 14), r: 12 + ((h >> 10) % 9) };

  const label = (
    brand && name.toUpperCase().startsWith(brand.toUpperCase())
      ? name.slice(brand.length).trim()
      : name
  ).toUpperCase();

  const lines = wrap(label, 14, 2);
  const gradId = `pph-${hash(seed + "g")}`;

  // shrink the type if a line still runs long after wrapping
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = longest > 16 ? 5.6 : longest > 12 ? 6.6 : 8;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      {...(decorative
        ? { "aria-hidden": true as const }
        : { role: "img", "aria-label": `${name} — product photo coming soon` })}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill={`url(#${gradId})`} />

      <g fill="#FFFFFF">
        <circle cx={c1.cx} cy={c1.cy} r={c1.r} opacity="0.05" />
        <circle cx={c2.cx} cy={c2.cy} r={c2.r} opacity="0.07" />
        <circle cx={c3.cx} cy={c3.cy} r={c3.r} opacity="0.04" />
      </g>

      <g
        fill="#FFFFFF"
        fillOpacity="0.42"
        fontFamily="var(--font-body), system-ui, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="1.1"
        textAnchor="middle"
      >
        {lines.map((line, i) => (
          <text
            key={line + i}
            x="50"
            y={50 + (i - (lines.length - 1) / 2) * (fontSize * 1.35) + fontSize * 0.35}
          >
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
}
