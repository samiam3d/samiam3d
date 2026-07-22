import { useEffect, useRef } from "react";

const letters = ["s", "a", "m", "i", "a", "m", "3", "D"];
const emissionIntervalMs = 136;
const minimumEmissionDistance = 18;
const particleLifetimeMs = 720;
const particlePoolSize = 7;
const cursorFollowRate = 24;
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
    let letterIndex = 0;
    let particleIndex = 0;
    let frameId = 0;
    let boundsFrameId = 0;
    let lastFrameTime = 0;
    let pointerX = -100;
    let pointerY = -100;
    let trailX = -100;
    let trailY = -100;
    let hasPointer = false;
    let isOverHero = false;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;

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
        speed > 0.25
          ? Math.atan2(-velocityY, -velocityX)
          : -Math.PI / 2;
      const angle = trailAngle + (Math.random() - 0.5) * 0.42;
      const distance = 48 + Math.random() * 44;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance - 16;
      const particleRotation = -12 + Math.random() * 24;

      particleAnimations[poolIndex]?.cancel();
      particle.textContent = letters[letterIndex % letters.length];
      let animation: Animation;
      try {
        animation = particle.animate(
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
      } catch {
        return;
      }
      particleAnimations[poolIndex] = animation;
      animation.onfinish = () => {
        if (particleAnimations[poolIndex] === animation) {
          animation.cancel();
          particleAnimations[poolIndex] = null;
        }
      };
      particleIndex += 1;
      letterIndex += 1;
    };

    const updateHeroSpotlight = (x: number, y: number) => {
      if (!heroTitle || !heroRect) return;

      const nextIsOverHero =
        x >= heroRect.left &&
        x <= heroRect.right &&
        y >= heroRect.top &&
        y <= heroRect.bottom;

      if (nextIsOverHero) {
        heroTitle.style.setProperty("--sheen-x", `${x - heroRect.left}px`);
        heroTitle.style.setProperty("--sheen-y", `${y - heroRect.top}px`);
      }

      if (nextIsOverHero !== isOverHero) {
        isOverHero = nextIsOverHero;
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursor.classList.toggle("is-over-hero", isOverHero);
      }
    };

    const renderCursor = () => {
      cursor.style.setProperty(
        "transform",
        `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`,
      );
      updateHeroSpotlight(pointerX, pointerY);
    };

    const paintCursor = (timestamp: number) => {
      frameId = 0;
      const elapsedSeconds = lastFrameTime
        ? Math.min((timestamp - lastFrameTime) / 1000, 0.05)
        : 1 / 60;
      const smoothing = 1 - Math.exp(-cursorFollowRate * elapsedSeconds);
      lastFrameTime = timestamp;
      const previousTrailX = trailX;
      const previousTrailY = trailY;
      trailX += (pointerX - trailX) * smoothing;
      trailY += (pointerY - trailY) * smoothing;
      renderCursor();

      const distanceSinceEmission = Math.hypot(
        trailX - lastEmissionX,
        trailY - lastEmissionY,
      );
      if (
        timestamp - lastEmission >= emissionIntervalMs &&
        distanceSinceEmission >= minimumEmissionDistance
      ) {
        lastEmission = timestamp;
        lastEmissionX = trailX;
        lastEmissionY = trailY;
        emitLetter(
          trailX,
          trailY,
          trailX - previousTrailX,
          trailY - previousTrailY,
        );
      }

      if (Math.hypot(pointerX - trailX, pointerY - trailY) > 0.1) {
        frameId = window.requestAnimationFrame(paintCursor);
      } else {
        trailX = pointerX;
        trailY = pointerY;
        renderCursor();
        lastFrameTime = 0;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!hasPointer) {
        trailX = pointerX;
        trailY = pointerY;
        lastEmission = performance.now();
        lastEmissionX = trailX;
        lastEmissionY = trailY;
        hasPointer = true;
      }
      if (!frameId) frameId = window.requestAnimationFrame(paintCursor);
    };

    const handlePointerLeave = () => {
      hasPointer = false;
      lastFrameTime = 0;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
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
      if (frameId) window.cancelAnimationFrame(frameId);
      if (boundsFrameId) window.cancelAnimationFrame(boundsFrameId);
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
