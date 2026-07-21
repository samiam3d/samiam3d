import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { portfolioHtml } from "@/lib/portfolio-content";

type PortfolioImage = {
  src: string;
  alt: string;
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const activeImage = images[activeIndex];

  const showPrevious = useCallback(() => {
    onChange((activeIndex - 1 + images.length) % images.length);
  }, [activeIndex, images.length, onChange]);

  const showNext = useCallback(() => {
    onChange((activeIndex + 1) % images.length);
  }, [activeIndex, images.length, onChange]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose, showNext, showPrevious]);

  if (!activeImage) return null;

  return createPortal(
    <div
      className="lightbox-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio image viewer"
      >
        <div className="lightbox__toolbar">
          <span className="lightbox__counter" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            className="lightbox__close"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close image viewer</span>
          </button>
        </div>

        <div
          className="lightbox__stage"
          onPointerDown={(event) => {
            touchStartX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (touchStartX.current === null) return;
            const travel = event.clientX - touchStartX.current;
            if (travel > 60) showPrevious();
            if (travel < -60) showNext();
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            className="lightbox__nav lightbox__nav--previous"
            onClick={showPrevious}
            aria-label="Previous image"
          >
            ←
          </button>
          <img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
          />
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={showNext}
            aria-label="Next image"
          >
            →
          </button>
        </div>

        <p className="lightbox__caption">
          {activeImage.alt || "Portfolio image"}
        </p>
      </div>
    </div>,
    document.body,
  );
}

export function PortfolioContent() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rolodexes = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".wp-block-gallery-5, .wp-block-gallery-10",
      ),
    );
    if (!rolodexes.length) return;

    const cleanups = rolodexes.map((rolodex, galleryIndex) => {
      const cards = Array.from(
        rolodex.querySelectorAll<HTMLElement>(":scope > .wp-block-image"),
      );
      let frameId = 0;

      rolodex.tabIndex = 0;
      rolodex.setAttribute("role", "region");
      rolodex.setAttribute(
        "aria-label",
        `Tales poster gallery ${galleryIndex + 1}. Scroll horizontally.`,
      );

      const updateCards = () => {
        frameId = 0;
        const galleryRect = rolodex.getBoundingClientRect();
        const galleryCenter = galleryRect.left + galleryRect.width / 2;

        cards.forEach((card) => {
          if (reduceMotion.matches) {
            card.style.removeProperty("transform");
            card.style.removeProperty("opacity");
            card.style.removeProperty("z-index");
            return;
          }

          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = (cardCenter - galleryCenter) / cardRect.width;
          const clampedDistance = Math.max(-2.4, Math.min(2.4, distance));
          const depth = Math.min(Math.abs(clampedDistance), 2.4);

          card.style.transform = `perspective(1200px) translateZ(${-depth * 42}px) rotateY(${-clampedDistance * 11}deg) scale(${1 - depth * 0.055})`;
          card.style.opacity = `${1 - depth * 0.13}`;
          card.style.zIndex = `${30 - Math.round(depth * 10)}`;
        });
      };

      const requestCardUpdate = () => {
        if (!frameId) frameId = window.requestAnimationFrame(updateCards);
      };

      const handleWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        const atStart = rolodex.scrollLeft <= 0;
        const atEnd =
          rolodex.scrollLeft >= rolodex.scrollWidth - rolodex.clientWidth - 1;
        if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd))
          return;
        event.preventDefault();
        rolodex.scrollLeft += event.deltaY;
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        rolodex.scrollBy({
          left:
            (event.key === "ArrowRight" ? 1 : -1) * rolodex.clientWidth * 0.42,
          behavior: reduceMotion.matches ? "auto" : "smooth",
        });
      };

      rolodex.addEventListener("scroll", requestCardUpdate, { passive: true });
      rolodex.addEventListener("wheel", handleWheel, { passive: false });
      rolodex.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", requestCardUpdate);
      updateCards();

      return () => {
        if (frameId) window.cancelAnimationFrame(frameId);
        rolodex.removeEventListener("scroll", requestCardUpdate);
        rolodex.removeEventListener("wheel", handleWheel);
        rolodex.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", requestCardUpdate);
        cards.forEach((card) => card.removeAttribute("style"));
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const image =
      target.closest<HTMLImageElement>("img") ??
      target
        .closest<HTMLAnchorElement>("a")
        ?.querySelector<HTMLImageElement>("img");
    if (!image) return;

    event.preventDefault();
    const imageElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLImageElement>("img"),
    );
    const index = imageElements.indexOf(image);
    if (index < 0) return;

    setImages(
      imageElements.map((item) => ({
        src: item.currentSrc || item.src,
        alt: item.alt,
      })),
    );
    setActiveIndex(index);
  };

  return (
    <>
      <div
        className="portfolio-content"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: portfolioHtml }}
      />
      {activeIndex !== null && (
        <ImageLightbox
          images={images}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}
