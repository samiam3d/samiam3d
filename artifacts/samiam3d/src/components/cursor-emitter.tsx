import { useEffect, useRef } from "react";

const letters = ["s", "a", "m", "i", "a", "m", "3", "D"];
const emissionIntervalMs = 136;
const minimumEmissionDistance = 18;
const particleLifetimeMs = 720;
const particlePoolSize = 6;
const particleSlots = Array.from(
  { length: particlePoolSize },
  (_, index) => index,
);

export function CursorEmitter() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (reduceMotion.matches || coarsePointer.matches) return;

    const cursor = cursorRef.current;
    const particlePool = particleRefs.current.filter(
      (particle): particle is HTMLSpanElement => particle !== null,
    );
    if (!cursor || particlePool.length === 0) return;

    document.documentElement.classList.add("has-custom-cursor");
    const heroTitle = document.querySelector<HTMLElement>(".hero__title");

    const particleAnimations: Array<Animation | null> = particlePool.map(
      () => null,
    );

    let lastEmission = performance.now();
    let lastEmissionX = -100;
    let lastEmissionY = -100;
    let lastPointerX = -100;
    let lastPointerY = -100;
    let letterIndex = 0;
    let particleIndex = 0;
    let boundsFrameId = 0;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;
    let isOverHero = false;
    let hasPointer = false;
    let rafId = 0;
    let hasPendingPointer = false;
    let pendingPointerX = -100;
    let pendingPointerY = -100;

    const refreshHeroBounds = () => {
      boundsFrameId = 0;
      heroRect = heroTitle?.getBoundingClientRect() ?? null;
    };

    const scheduleHeroBoundsRefresh = () => {
      if (heroTitle && !boundsFrameId) {
        boundsFrameId = window.requestAnimationFrame(refreshHeroBounds);
      }
    };

    const heroResizeObserver =
      heroTitle && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleHeroBoundsRefresh)
        : null;
    if (heroTitle) heroResizeObserver?.observe(heroTitle);

    const emitLetter = (
      x: number,
      y: number,
      velocityX: number,
      velocityY: number,
    ) => {
      const poolIndex = particleIndex % particlePool.length;
      const particle = particlePool[poolIndex];
      if (typeof particle.animate !== "function") return;

      const speed = Math.hypot(velocityX, velocityY);
      const trailAngle =
        speed > 0.25 ? Math.atan2(-velocityY, -velocityX) : -Math.PI / 2;
      const angle = trailAngle + (Math.random() - 0.5) * 0.42;
      const distance = 48 + Math.random() * 44;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance - 16;
      const particleRotation = -12 + Math.random() * 24;

      particleAnimations[poolIndex]?.cancel();
      particle.textContent = letters[letterIndex % letters.length];
      const animation = particle.animate(
        [
          {
            opacity: 0.95,
            transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1) rotate(0deg)`,
          },
          {
            opacity: 0,
            transform: `translate3d(${x + particleX}px, ${y + particleY}px, 0) translate(-50%, -50%) scale(0.55) rotate(${particleRotation}deg)`,
          },
        ],
        {
          duration: particleLifetimeMs,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );

      particleAnimations[poolIndex] = animation;
      animation.onfinish = () => {
        if (particleAnimations[poolIndex] === animation) {
          particleAnimations[poolIndex] = null;
        }
      };

      particleIndex += 1;
      letterIndex += 1;
    };

    const updateCursorPosition = (x: number, y: number) => {
      const roundedX = Math.round(x);
      const roundedY = Math.round(y);

      cursor.style.transform =
        `translate3d(${roundedX}px, ${roundedY}px, 0) translate(-50%, -50%)`;

      if (!heroTitle || !heroRect) return;

      const nextIsOverHero =
        roundedX >= heroRect.left &&
        roundedX <= heroRect.right &&
        roundedY >= heroRect.top &&
        roundedY <= heroRect.bottom;

      if (nextIsOverHero) {
        heroTitle.style.setProperty("--sheen-x", `${roundedX - heroRect.left}px`);
        heroTitle.style.setProperty("--sheen-y", `${roundedY - heroRect.top}px`);
      }

      if (nextIsOverHero !== isOverHero) {
        isOverHero = nextIsOverHero;
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursor.classList.toggle("is-over-hero", isOverHero);
      }
    };

    const processPointer = () => {
      rafId = 0;
      if (!hasPendingPointer) return;
      hasPendingPointer = false;

      const now = performance.now();
      const pointerX = pendingPointerX;
      const pointerY = pendingPointerY;

      const distanceSinceEmission = Math.hypot(
        pointerX - lastEmissionX,
        pointerY - lastEmissionY,
      );
      if (
        now - lastEmission >= emissionIntervalMs &&
        distanceSinceEmission >= minimumEmissionDistance
      ) {
        emitLetter(
          pointerX,
          pointerY,
          pointerX - lastPointerX,
          pointerY - lastPointerY,
        );
        lastEmission = now;
        lastEmissionX = pointerX;
        lastEmissionY = pointerY;
      }

      updateCursorPosition(pointerX, pointerY);
      lastPointerX = pointerX;
      lastPointerY = pointerY;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      pendingPointerX = event.clientX;
      pendingPointerY = event.clientY;
      hasPendingPointer = true;

      if (!hasPointer) {
        hasPointer = true;
        lastPointerX = pendingPointerX;
        lastPointerY = pendingPointerY;
        lastEmission = performance.now();
        lastEmissionX = pendingPointerX;
        lastEmissionY = pendingPointerY;
      }

      if (!rafId) {
        rafId = window.requestAnimationFrame(processPointer);
      }
    };

    const handlePointerLeave = () => {
      hasPointer = false;
      hasPendingPointer = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (isOverHero) {
        isOverHero = false;
        heroTitle?.classList.remove("is-cursor-active");
        cursor.classList.remove("is-over-hero");
      }
      cursor.classList.add("is-hidden");
    };

    const handlePointerEnter = () => {
      cursor.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("resize", scheduleHeroBoundsRefresh);
    window.addEventListener("scroll", scheduleHeroBoundsRefresh, {
      passive: true,
    });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      heroTitle?.classList.remove("is-cursor-active");
      heroResizeObserver?.disconnect();
      if (boundsFrameId) window.cancelAnimationFrame(boundsFrameId);
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", scheduleHeroBoundsRefresh);
      window.removeEventListener("scroll", scheduleHeroBoundsRefresh);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
      particleAnimations.forEach((animation) => animation?.cancel());
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-emitter" aria-hidden="true">
        <span className="cursor-emitter__dot" />
      </div>
      {particleSlots.map((slot) => (
        <span
          key={slot}
          ref={(particle) => {
            particleRefs.current[slot] = particle;
          }}
          className="cursor-letter"
          aria-hidden="true"
        />
      ))}
    </>
  );
}
