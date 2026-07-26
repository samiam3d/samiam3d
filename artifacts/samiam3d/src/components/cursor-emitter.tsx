import { useEffect, useRef } from "react";

const letters = ["s", "a", "m", "i", "a", "m", "3", "D"];
const emissionIntervalMs = 210;
const minimumEmissionDistance = 42;
const particleLifetimeMs = 560;
const particlePoolSize = 3;
const maximumPaintStamps = 48;
const revealRadius = 176;
const particleSlots = Array.from(
  { length: particlePoolSize },
  (_, index) => index,
);

export function CursorEmitter() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const cursor = cursorRef.current;
    const particlePool = particleRefs.current.filter(
      (particle): particle is HTMLSpanElement => particle !== null,
    );
    if (!cursor || particlePool.length === 0) return;

    const heroTitle = document.querySelector<HTMLElement>(".hero__title");
    const heroReveal = heroTitle?.querySelector<HTMLElement>(".hero__reveal");
    const heroRevealContent = heroTitle?.querySelector<HTMLElement>(
      ".hero__reveal-content",
    );
    const heroPaintLayer = heroTitle?.querySelector<HTMLElement>(
      ".hero__paint-layer",
    );

    document.documentElement.classList.add("has-custom-cursor");

    const particleAnimations: Array<Animation | null> = particlePool.map(
      () => null,
    );
    let pointerFrame = 0;
    let boundsFrame = 0;
    let lastEmissionTime = performance.now();
    let lastEmissionX = -100;
    let lastEmissionY = -100;
    let lastPointerX = -100;
    let lastPointerY = -100;
    let pendingPointerX = -100;
    let pendingPointerY = -100;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;
    let letterIndex = 0;
    let particleIndex = 0;
    let hasPointer = false;
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
      if (!heroPaintLayer || !heroRevealContent) return;
      if (paintStampCount >= maximumPaintStamps) return;

      const distance = Math.hypot(localX - lastPaintX, localY - lastPaintY);
      if (distance < minimumEmissionDistance && paintStampCount > 0) return;

      const stamp = document.createElement("span");
      stamp.className = "hero__reveal-stamp";
      stamp.style.left = `${localX - revealRadius}px`;
      stamp.style.top = `${localY - revealRadius}px`;

      const content = document.createElement("span");
      content.className = "hero__reveal-content";
      content.innerHTML = heroRevealContent.innerHTML;
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

    const emitLetter = (
      x: number,
      y: number,
      pointerVelocityX: number,
      pointerVelocityY: number,
    ) => {
      const particle = particlePool[particleIndex % particlePool.length];
      if (!particle || typeof particle.animate !== "function") return;

      const speed = Math.hypot(pointerVelocityX, pointerVelocityY);
      const travelAngle =
        speed > 0.2
          ? Math.atan2(-pointerVelocityY, -pointerVelocityX)
          : -Math.PI / 2;
      const angle = travelAngle + (Math.random() - 0.5) * 0.28;
      const distance = 42 + Math.random() * 28;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance - 12;
      const particleRotation = -10 + Math.random() * 20;
      const poolIndex = particleIndex % particlePool.length;

      particleAnimations[poolIndex]?.cancel();
      particle.textContent = letters[letterIndex % letters.length];
      particle.style.opacity = "1";
      const animation = particle.animate(
        [
          {
            opacity: 0.95,
            transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(1) rotate(0deg)`,
          },
          {
            opacity: 0,
            transform: `translate3d(${x + particleX}px, ${y + particleY}px, 0) translate(-50%, -50%) scale(0.62) rotate(${particleRotation}deg)`,
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
        if (particleAnimations[poolIndex] !== animation) return;
        particleAnimations[poolIndex] = null;
        particle.style.opacity = "0";
        particle.textContent = "";
      };

      particleIndex += 1;
      letterIndex += 1;
    };

    const processPointer = () => {
      pointerFrame = 0;
      if (!hasPendingPointer) return;
      hasPendingPointer = false;

      const pointerX = pendingPointerX;
      const pointerY = pendingPointerY;
      const now = performance.now();
      const distanceSinceEmission = Math.hypot(
        pointerX - lastEmissionX,
        pointerY - lastEmissionY,
      );

      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      setHeroReaction(pointerX, pointerY);

      if (
        now - lastEmissionTime >= emissionIntervalMs &&
        distanceSinceEmission >= minimumEmissionDistance
      ) {
        emitLetter(
          pointerX,
          pointerY,
          pointerX - lastPointerX,
          pointerY - lastPointerY,
        );
        lastEmissionTime = now;
        lastEmissionX = pointerX;
        lastEmissionY = pointerY;
      }

      lastPointerX = pointerX;
      lastPointerY = pointerY;
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

      if (!hasPointer) {
        hasPointer = true;
        lastPointerX = pendingPointerX;
        lastPointerY = pendingPointerY;
        lastEmissionX = pendingPointerX;
        lastEmissionY = pendingPointerY;
        lastEmissionTime = performance.now();
      }

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
      hasPointer = true;
      pendingPointerX = event.clientX;
      pendingPointerY = event.clientY;
      hasPendingPointer = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastEmissionX = -100;
      lastEmissionY = -100;
      lastEmissionTime = performance.now() - emissionIntervalMs;
      cursor.classList.remove("is-hidden");
      if (!pointerFrame) {
        pointerFrame = window.requestAnimationFrame(processPointer);
      }
    };

    const handlePointerLeave = () => {
      hasPointer = false;
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

    const handleVisibilityChange = () => {
      if (!document.hidden) return;
      particleAnimations.forEach((animation) => animation?.cancel());
      particlePool.forEach((particle) => {
        particle.style.opacity = "0";
        particle.textContent = "";
      });
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
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      heroTitle?.classList.remove("is-cursor-active");
      heroResizeObserver?.disconnect();
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      if (boundsFrame) window.cancelAnimationFrame(boundsFrame);
      particleAnimations.forEach((animation) => animation?.cancel());
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("resize", scheduleHeroBoundsRefresh);
      window.removeEventListener("scroll", scheduleHeroBoundsRefresh);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
