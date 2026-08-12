/**
 * Stand-in thumbnail for videos that don't have a real one yet.
 *
 * Same deterministic-gradient language as ProductPlaceholder/AvatarPlaceholder
 * so all three placeholder systems read as one visual family. 16:9 and text-
 * free by design — real YouTube thumbnails carry the title as page text below
 * the image, not baked into the frame, so this matches that convention.
 */

interface VideoPlaceholderProps {
  title: string;
  seed: string;
}

function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function VideoPlaceholder({ title, seed }: VideoPlaceholderProps) {
  const h = hash(seed);

  const hue = 78 + (h % 18);
  const sat = 42 + ((h >> 3) % 30);
  const light = 12 + ((h >> 7) % 11);
  const angle = [135, 155, 115, 170][(h >> 11) % 4];

  const from = `hsl(${hue} 26% 5%)`;
  const to = `hsl(${hue} ${sat}% ${light}%)`;
  const gradId = `vph-${hash(seed + "g")}`;

  return (
    <svg
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label={`${title} — video coming soon`}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <rect width="160" height="90" fill={`url(#${gradId})`} />

      <g fill="#FFFFFF">
        <circle cx="80" cy="45" r="20" fillOpacity="0.14" />
        <path d="M74 35 L92 45 L74 55 Z" fillOpacity="0.9" />
      </g>
    </svg>
  );
}
