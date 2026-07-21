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
    let lastEmission = 0;
    let letterIndex = 0;
    let frameId = 0;
    let pointerX = -100;
    let pointerY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let hasPointer = false;

    const paintCursor = () => {
      frameId = 0;
      cursorX += (pointerX - cursorX) * 0.32;
      cursorY += (pointerY - cursorY) * 0.32;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`,
      );

      if (heroTitle) {
        const heroRect = heroTitle.getBoundingClientRect();
        const isOverHero =
          cursorX >= heroRect.left &&
          cursorX <= heroRect.right &&
          cursorY >= heroRect.top &&
          cursorY <= heroRect.bottom;

        heroTitle.style.setProperty("--sheen-x", `${cursorX - heroRect.left}px`);
        heroTitle.style.setProperty("--sheen-y", `${cursorY - heroRect.top}px`);
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursorRef.current?.classList.toggle("is-over-hero", isOverHero);
      }

      if (Math.abs(pointerX - cursorX) + Math.abs(pointerY - cursorY) > 0.25) {
        frameId = window.requestAnimationFrame(paintCursor);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!hasPointer) {
        cursorX = pointerX;
        cursorY = pointerY;
        hasPointer = true;
      }
      if (!frameId) frameId = window.requestAnimationFrame(paintCursor);

      const now = performance.now();
      if (now - lastEmission < 68) return;
      lastEmission = now;

      const particle = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = 38 + Math.random() * 64;
      particle.className = "cursor-letter";
      particle.textContent = letters[letterIndex % letters.length];
      particle.style.left = `${cursorX}px`;
      particle.style.top = `${cursorY}px`;
      particle.style.setProperty(
        "--particle-x",
        `${Math.cos(angle) * distance}px`,
      );
      particle.style.setProperty(
        "--particle-y",
        `${Math.sin(angle) * distance - 16}px`,
      );
      particle.style.setProperty(
        "--particle-rotation",
        `${-28 + Math.random() * 56}deg`,
      );
      document.body.appendChild(particle);
      letterIndex += 1;

      particle.addEventListener("animationend", () => particle.remove(), {
        once: true,
      });
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
      document
        .querySelectorAll(".cursor-letter")
        .forEach((node) => node.remove());
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor-emitter" aria-hidden="true">
      <span className="cursor-emitter__dot" />
    </div>
  );
}
