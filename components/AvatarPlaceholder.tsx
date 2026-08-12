/**
 * Stand-in avatar for testimonials without a real customer photo.
 *
 * Deterministic, same seeding approach as ProductPlaceholder so the two
 * placeholder systems read as one visual language instead of two. Swap in a
 * real photo by setting `photo` on the testimonial.
 */

interface AvatarPlaceholderProps {
  name: string;
  seed: string;
}

function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AvatarPlaceholder({ name, seed }: AvatarPlaceholderProps) {
  const h = hash(seed);

  const hue = 78 + (h % 18); // 78–95, same band as ProductPlaceholder
  const sat = 42 + ((h >> 3) % 30);
  const light = 18 + ((h >> 7) % 14);
  const angle = [135, 155, 115, 170][(h >> 11) % 4];

  const from = `hsl(${hue} 26% 10%)`;
  const to = `hsl(${hue} ${sat}% ${light}%)`;
  const gradId = `aph-${hash(seed + "g")}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      role="img"
      aria-label={`${name} — customer photo coming soon`}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
      <text
        x="50"
        y="50"
        dy="0.35em"
        textAnchor="middle"
        fill="#FFFFFF"
        fillOpacity="0.85"
        fontFamily="var(--font-body), system-ui, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="0.5"
      >
        {initials(name)}
      </text>
    </svg>
  );
}
