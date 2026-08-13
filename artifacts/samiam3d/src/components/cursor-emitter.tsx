import { useEffect, useRef } from "react";

const minimumPaintDistance = 42;
const maximumPaintStamps = 48;
// Keep the persistent paint comfortably larger than the wordmark height so the
// rounded edge of the D is covered when the draw pass reaches it.
const revealRadius = 208;

/**
 * A deliberately small cursor layer. The old cursor emitted animated letter
 * spans on every pointer movement; this keeps only the single blue glass dot
 * and the hero's separate, intentional draw-to-reveal interaction.
 */
export function CursorEmitter() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const heroTitle = document.querySelector<HTMLElement>(".hero__title");
    const heroReveal = heroTitle?.querySelector<HTMLElement>(".hero__reveal");
    const heroRevealContent = heroTitle?.querySelector<HTMLElement>(
      ".hero__reveal-content",
    );
    const heroPaintLayer = heroTitle?.querySelector<HTMLElement>(
      ".hero__paint-layer",
    );
    const heroPaintSource = heroRevealContent?.querySelector<HTMLElement>(
      ".hero__sheen",
    );

    document.documentElement.classList.add("has-custom-cursor");

    let pointerFrame = 0;
    let boundsFrame = 0;
    let pendingPointerX = -100;
    let pendingPointerY = -100;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;
    let hasPendingPointer = false;
    let isOverHero = false;
    let activeTouchId: number | null = null;
    let paintStampCount = 0;
    let lastPaintX = -100;
    let lastPaintY = -100;

    const refreshHeroBounds = () => {
      boundsFrame = 0;
      heroRect = heroTitle?.getBoundingClientRect() ?? null;
    };

    const scheduleHeroBoundsRefresh = () => {
      if (!heroTitle || boundsFrame) return;
      boundsFrame = window.requestAnimationFrame(refreshHeroBounds);
    };

    const addPaintStamp = (localX: number, localY: number) => {
      if (!heroPaintLayer || !heroPaintSource) return;
      if (paintStampCount >= maximumPaintStamps) return;

      const distance = Math.hypot(localX - lastPaintX, localY - lastPaintY);
      if (distance < minimumPaintDistance && paintStampCount > 0) return;

      const stamp = document.createElement("span");
      stamp.className = "hero__reveal-stamp";
      stamp.style.left = `${localX - revealRadius}px`;
      stamp.style.top = `${localY - revealRadius}px`;

      const content = document.createElement("span");
      content.className = "hero__reveal-content";
      // Persistent stamps only keep the bright glass finish. Repeating the
      // offset depth layer causes dark seams where painted circles overlap.
      content.innerHTML = heroPaintSource.outerHTML;
      content.style.transform = `translate3d(${-localX + revealRadius}px, ${-localY + revealRadius}px, 0)`;
      stamp.append(content);
      heroPaintLayer.append(stamp);

      paintStampCount += 1;
      lastPaintX = localX;
      lastPaintY = localY;
    };

    const setHeroReaction = (clientX: number, clientY: number) => {
      if (!heroTitle || !heroReveal || !heroRevealContent || !heroRect) return;

      const nextIsOverHero =
        clientX >= heroRect.left &&
        clientX <= heroRect.right &&
        clientY >= heroRect.top &&
        clientY <= heroRect.bottom;

      if (nextIsOverHero) {
        const localX = clientX - heroRect.left;
        const localY = clientY - heroRect.top;
        heroReveal.style.transform = `translate3d(${localX - revealRadius}px, ${localY - revealRadius}px, 0)`;
        heroRevealContent.style.transform = `translate3d(${-localX + revealRadius}px, ${-localY + revealRadius}px, 0)`;
        addPaintStamp(localX, localY);
      }

      if (nextIsOverHero !== isOverHero) {
        isOverHero = nextIsOverHero;
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursor.classList.toggle("is-over-hero", isOverHero);
      }
    };

    const processPointer = () => {
      pointerFrame = 0;
      if (!hasPendingPointer) return;
      hasPendingPointer = false;

      const pointerX = pendingPointerX;
      const pointerY = pendingPointerY;
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      setHeroReaction(pointerX, pointerY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (
        event.pointerType &&
        event.pointerType !== "mouse" &&
        event.pointerType !== "touch" &&
        event.pointerType !== "pen"
      ) {
        return;
      }

      if (
        event.pointerType === "touch" &&
        (activeTouchId === null || event.pointerId !== activeTouchId)
      ) {
        return;
      }

      pendingPointerX = event.clientX;
      pendingPointerY = event.clientY;
      hasPendingPointer = true;

      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(processPointer);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      if (!event.isPrimary || !heroRect) return;

      const isOverHero =
        event.clientX >= heroRect.left &&
        event.clientX <= heroRect.right &&
        event.clientY >= heroRect.top &&
        event.clientY <= heroRect.bottom;
      if (!isOverHero) return;

      activeTouchId = event.pointerId;
      pendingPointerX = event.clientX;
      pendingPointerY = event.clientY;
      hasPendingPointer = true;
      cursor.classList.remove("is-hidden");
      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(processPointer);
      }
    };

    const handlePointerLeave = () => {
      hasPendingPointer = false;
      cursor.classList.add("is-hidden");
      if (isOverHero) {
        isOverHero = false;
        heroTitle?.classList.remove("is-cursor-active");
        cursor.classList.remove("is-over-hero");
      }
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (
        (event.pointerType !== "touch" && event.pointerType !== "pen") ||
        event.pointerId !== activeTouchId
      ) {
        return;
      }

      activeTouchId = null;
      handlePointerLeave();
    };

    const handlePointerEnter = () => {
      cursor.classList.remove("is-hidden");
    };

    const heroResizeObserver =
      heroTitle && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleHeroBoundsRefresh)
        : null;

    heroResizeObserver?.observe(heroTitle!);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
    window.addEventListener("resize", scheduleHeroBoundsRefresh);
    window.addEventListener("scroll", scheduleHeroBoundsRefresh, {
      passive: true,
    });
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      heroTitle?.classList.remove("is-cursor-active");
      heroResizeObserver?.disconnect();
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      if (boundsFrame) window.cancelAnimationFrame(boundsFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("resize", scheduleHeroBoundsRefresh);
      window.removeEventListener("scroll", scheduleHeroBoundsRefresh);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-emitter" aria-hidden="true">
      <span className="cursor-emitter__dot" />
    </div>
  );
}
