import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import VideoLibrary from "@/components/VideoLibrary";

export const metadata = {
  title: "How It's Used — Supplement World Zambia",
};

export default function VideosPage() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 pb-2">
        <div className="flex items-center gap-3 pt-6">
          <Link
            href="/"
            className="flex h-12 items-center gap-2 text-sm text-muted transition hover:text-ink"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        <h1 className="font-display text-3xl tracking-wide text-ink sm:text-4xl">
          HOW IT&apos;S USED
        </h1>
        <p className="mt-1 text-sm text-muted">
          Mixing demos, staff picks and customer routines — straight from our
          own channel.
        </p>
      </div>

      <VideoLibrary />
    </>
  );
}
