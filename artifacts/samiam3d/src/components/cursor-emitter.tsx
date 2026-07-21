import { useEffect, useRef } from "react";

const letters = ["s", "a", "m", "i", "a", "m", "3", "D"];

export function CursorEmitter() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    if (reduceMotion.matches || coarsePointer.matches) {
      return;
    }

    document.documentElement.classList.add("has-custom-cursor");
    const heroTitle = document.querySelector<HTMLElement>(".hero__title");
    const particlePool = Array.from({ length: 16 }, () => {
      const particle = document.createElement("span");
      particle.className = "cursor-letter";
      document.body.appendChild(particle);
      return particle;
    });
    let lastEmission = 0;
    let letterIndex = 0;
    let particleIndex = 0;
    let frameId = 0;
    let pointerX = -100;
    let pointerY = -100;

    const paintCursor = () => {
      frameId = 0;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`,
      );

      if (heroTitle) {
        const heroRect = heroTitle.getBoundingClientRect();
        const isOverHero =
          pointerX >= heroRect.left &&
          pointerX <= heroRect.right &&
          pointerY >= heroRect.top &&
          pointerY <= heroRect.bottom;

        heroTitle.style.setProperty("--sheen-x", `${pointerX - heroRect.left}px`);
        heroTitle.style.setProperty("--sheen-y", `${pointerY - heroRect.top}px`);
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursorRef.current?.classList.toggle("is-over-hero", isOverHero);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frameId) frameId = window.requestAnimationFrame(paintCursor);

      const now = performance.now();
      if (now - lastEmission < 55) return;
      lastEmission = now;

      const particle = particlePool[particleIndex % particlePool.length];
      const angle = Math.random() * Math.PI * 2;
      const distance = 38 + Math.random() * 64;
      particle.textContent = letters[letterIndex % letters.length];
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      const particleX = Math.cos(angle) * distance;
      const particleY = Math.sin(angle) * distance - 16;
      const rotation = -28 + Math.random() * 56;
      particle.getAnimations().forEach((animation) => animation.cancel());
      particle.animate(
        [
          {
            opacity: 0.95,
            transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
          },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${particleX}px), calc(-50% + ${particleY}px)) scale(0.55) rotate(${rotation}deg)`,
          },
        ],
        {
          duration: 720,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "forwards",
        },
      );
      letterIndex += 1;
      particleIndex += 1;
    };

    const handlePointerLeave = () => {
      cursorRef.current?.classList.add("is-hidden");
    };

    const handlePointerEnter = () => {
      cursorRef.current?.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      heroTitle?.classList.remove("is-cursor-active");
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
      particlePool.forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-emitter" aria-hidden="true">
      <span className="cursor-emitter__dot" />
    </div>
  );
}
