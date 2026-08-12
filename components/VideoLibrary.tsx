import Link from "next/link";
import Image from "next/image";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons/BrandIcons";
import { videos } from "@/data/videos";
import { products } from "@/data/products";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import { VideoPlatform } from "@/lib/types";

const PLATFORM_ICON: Record<VideoPlatform, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
};

/**
 * "How It's Used" — a dedicated feed at /videos, deliberately styled like a
 * YouTube feed (16:9 thumbnail, title + channel row underneath) because
 * that's the exact format this content lives in and gets clicked from.
 * Every card opens the real platform in a new tab rather than trying to
 * re-embed a player here.
 */
export default function VideoLibrary() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const product = products.find((p) => p.id === v.productId);
          const PlatformIcon = PLATFORM_ICON[v.platform];
          return (
            <Link
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2.5"
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-charcoal">
                {v.thumbnail ? (
                  <Image
                    src={v.thumbnail}
                    alt={v.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="transition duration-300 group-hover:scale-105">
                    <VideoPlaceholder title={v.title} seed={v.id} />
                  </div>
                )}
                <span className="absolute right-1.5 bottom-1.5 rounded bg-charcoal/80 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                  {v.category}
                </span>
              </div>

              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <PlatformIcon size={16} />
                </span>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition group-hover:text-brand">
                    {v.title}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    Supplement World Zambia
                    {product && (
                      <>
                        {" "}
                        · <span className="text-brand">{product.name}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
