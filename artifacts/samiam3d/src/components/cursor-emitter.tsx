import { useEffect, useRef } from "react";

/**
 * A blue glass cursor and a soft, transient spotlight on the hero wordmark.
 * Both layers follow pointer movement in a single animation frame.
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
    const heroGlow = heroTitle?.querySelector<HTMLElement>(".hero__glow");

    document.documentElement.classList.add("has-custom-cursor");

    let pointerFrame = 0;
    let boundsFrame = 0;
    let pendingPointerX = -100;
    let pendingPointerY = -100;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;
    let revealRadius = (heroReveal?.offsetWidth ?? 416) / 2;
    let hasPendingPointer = false;
    let isOverHero = false;
    let activeTouchId: number | null = null;

    const refreshHeroBounds = () => {
      boundsFrame = 0;
      heroRect = heroTitle?.getBoundingClientRect() ?? null;
      revealRadius = (heroReveal?.offsetWidth ?? 416) / 2;
    };

    const scheduleHeroBoundsRefresh = () => {
      if (!heroTitle || boundsFrame) return;
      boundsFrame = window.requestAnimationFrame(refreshHeroBounds);
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
        const spotlightTransform = `translate3d(${localX - revealRadius}px, ${localY - revealRadius}px, 0)`;
        heroReveal.style.transform = spotlightTransform;
        if (heroGlow) heroGlow.style.transform = spotlightTransform;
        heroRevealContent.style.transform = `translate3d(${-localX + revealRadius}px, ${-localY + revealRadius}px, 0)`;
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
      cursor.classList.remove("is-hidden");
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
      activeTouchId = null;
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
