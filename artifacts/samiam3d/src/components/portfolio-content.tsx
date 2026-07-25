import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { portfolioHtml } from "@/lib/portfolio-content";
import { preparePortfolioLayout } from "@/lib/prepare-portfolio-layout";

type PortfolioImage = {
  alt: string;
  src: string;
};

function ImageLightbox({
  images,
  activeIndex,
  onChange,
  onClose,
}: {
  images: PortfolioImage[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const touchStartX = useRef<number | null>(null);
  const activeImage = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  const showPrevious = useCallback(() => {
    onChange((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onChange]);

  const showNext = useCallback(() => {
    onChange((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onChange]);

  useEffect(() => {
    if (!hasMultipleImages) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, showNext, showPrevious]);

  if (!activeImage) return null;

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="lightbox-backdrop" />
        <Dialog.Content className="lightbox">
          <Dialog.Title className="sr-only">
            Portfolio image viewer
          </Dialog.Title>

          <div className="lightbox__toolbar">
            <span className="lightbox__counter" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
            <Dialog.Close asChild>
              <button type="button" className="lightbox__close">
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close image viewer</span>
              </button>
            </Dialog.Close>
          </div>

          <div
            className="lightbox__stage"
            onPointerDown={(event) => {
              touchStartX.current = event.clientX;
            }}
            onPointerCancel={() => {
              touchStartX.current = null;
            }}
            onPointerUp={(event) => {
              if (!hasMultipleImages || touchStartX.current === null) return;
              const travel = event.clientX - touchStartX.current;
              if (travel > 60) showPrevious();
              if (travel < -60) showNext();
              touchStartX.current = null;
            }}
          >
            {hasMultipleImages && (
              <button
                type="button"
                className="lightbox__nav lightbox__nav--previous"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                ←
              </button>
            )}
            <img
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
            />
            {hasMultipleImages && (
              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                onClick={showNext}
                aria-label="Next image"
              >
                →
              </button>
            )}
          </div>

          <Dialog.Description className="lightbox__caption">
            {activeImage.alt || "Portfolio image"}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function playVideo(button: HTMLButtonElement) {
  const videoId = button.dataset.videoId;
  const wrapper = button.closest<HTMLElement>(".wp-block-embed__wrapper");
  if (!videoId || !wrapper || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  iframe.title = button.getAttribute("aria-label")?.replace(/^Play /, "") ||
    "Portfolio video";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  wrapper.replaceChildren(iframe);
}

export function PortfolioContent() {
  const preparedHtml = useMemo(() => preparePortfolioLayout(portfolioHtml), []);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const videoButton = target.closest<HTMLButtonElement>("[data-video-id]");
    if (videoButton) {
      playVideo(videoButton);
      return;
    }

    const trigger =
      target.closest<HTMLElement>("[data-lightbox-image]") ??
      target.querySelector<HTMLElement>("[data-lightbox-image]");
    if (!trigger) return;

    event.preventDefault();
    const group =
      trigger.closest<HTMLElement>("[data-lightbox-group]") ?? trigger;
    const triggers = Array.from(
      group.querySelectorAll<HTMLElement>("[data-lightbox-image]"),
    );
    const normalizedTriggers = triggers.length > 0 ? triggers : [trigger];
    const index = normalizedTriggers.indexOf(trigger);
    if (index < 0) return;

    setImages(
      normalizedTriggers
        .map((item) => {
          const image = item.querySelector<HTMLImageElement>("img");
          const source =
            item.dataset.fullSrc ||
            image?.dataset.fullSrc ||
            image?.currentSrc ||
            image?.src;
          if (!image || !source) return null;
          return { src: source, alt: image.alt };
        })
        .filter((image): image is PortfolioImage => image !== null),
    );
    setActiveIndex(index);
  };

  return (
    <>
      <div
        className="portfolio-content"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: preparedHtml }}
      />
      {activeIndex !== null && images.length > 0 && (
        <ImageLightbox
          images={images}
          activeIndex={Math.min(activeIndex, images.length - 1)}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}
