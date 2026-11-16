import { cn } from "#lib/utils";
import { PlayIcon } from "lucide-react";
import { useState } from "react";

/**
 * A YouTube video that only loads the player once clicked.
 * Until then it's a thumbnail: no YouTube script or cookie on page load.
 */
export function YoutubeVideo(props: { id: string; title: string; className?: string }) {
  const { id, title, className } = props;

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border bg-muted shadow-sm",
        className,
      )}
    >
      {isPlaying ? (
        // The player needs scripts and its own origin, which would cancel out any sandbox.
        // oxlint-disable-next-line react/iframe-missing-sandbox
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="group absolute inset-0 size-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-8 ring-primary/25 transition-transform duration-200 ease-out group-hover:scale-110">
              <PlayIcon aria-hidden="true" className="ms-1 size-6 fill-current" />
            </span>
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
