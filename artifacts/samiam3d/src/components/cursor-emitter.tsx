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
    let lastEmission = 0;
    let letterIndex = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${event.clientX}px, ${event.clientY}px, 0)`,
      );

      const now = performance.now();
      if (now - lastEmission < 55) return;
      lastEmission = now;

      const particle = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = 22 + Math.random() * 42;
      particle.className = "cursor-letter";
      particle.textContent = letters[letterIndex % letters.length];
      particle.style.left = `${event.clientX}px`;
      particle.style.top = `${event.clientY}px`;
      particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance - 16}px`);
      particle.style.setProperty("--particle-rotation", `${-28 + Math.random() * 56}deg`);
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

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
      document.querySelectorAll(".cursor-letter").forEach((node) => node.remove());
    };
  }, []);

  return <div ref={cursorRef} className="cursor-emitter" aria-hidden="true" />;
}
