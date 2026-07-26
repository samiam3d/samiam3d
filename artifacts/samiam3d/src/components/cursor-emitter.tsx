import { useEffect, useRef } from "react";

const letters = ["s", "a", "m", "i", "a", "m", "3", "D"];
const emissionIntervalMs = 190;
const minimumEmissionDistance = 34;
const particleLifetimeMs = 620;
const maximumParticles = 5;
const revealRadius = 176;

type LetterParticle = {
  age: number;
  letter: string;
  rotation: number;
  rotationVelocity: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
};

export function CursorEmitter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !cursor || !context) return;

    const heroTitle = document.querySelector<HTMLElement>(".hero__title");
    const heroReveal = heroTitle?.querySelector<HTMLElement>(".hero__reveal");
    const heroRevealContent = heroTitle?.querySelector<HTMLElement>(
      ".hero__reveal-content",
    );

    document.documentElement.classList.add("has-custom-cursor");

    const particles: LetterParticle[] = [];
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let deviceScale = 1;
    let pointerFrame = 0;
    let particleFrame = 0;
    let boundsFrame = 0;
    let lastParticleFrameTime = performance.now();
    let lastEmissionTime = performance.now();
    let lastEmissionX = -100;
    let lastEmissionY = -100;
    let lastPointerX = -100;
    let lastPointerY = -100;
    let pendingPointerX = -100;
    let pendingPointerY = -100;
    let heroRect = heroTitle?.getBoundingClientRect() ?? null;
    let letterIndex = 0;
    let hasPointer = false;
    let hasPendingPointer = false;
    let isOverHero = false;
    let activeTouchId: number | null = null;

    const resizeCanvas = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvasWidth * deviceScale);
      canvas.height = Math.round(canvasHeight * deviceScale);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "#fff";
      context.font = '46px "Righteous", sans-serif';
    };

    const refreshHeroBounds = () => {
      boundsFrame = 0;
      heroRect = heroTitle?.getBoundingClientRect() ?? null;
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
        heroReveal.style.transform = `translate3d(${localX - revealRadius}px, ${localY - revealRadius}px, 0)`;
        heroRevealContent.style.transform = `translate3d(${-localX + revealRadius}px, ${-localY + revealRadius}px, 0)`;
      }

      if (nextIsOverHero !== isOverHero) {
        isOverHero = nextIsOverHero;
        heroTitle.classList.toggle("is-cursor-active", isOverHero);
        cursor.classList.toggle("is-over-hero", isOverHero);
      }
    };

    const renderParticles = (time: number) => {
      particleFrame = 0;
      const delta = Math.min((time - lastParticleFrameTime) / 1000, 0.032);
      lastParticleFrameTime = time;
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.age += delta * 1000;
        if (particle.age >= particleLifetimeMs) {
          particles.splice(index, 1);
          continue;
        }

        const progress = particle.age / particleLifetimeMs;
        particle.x += particle.velocityX * delta;
        particle.y += particle.velocityY * delta;
        particle.velocityY += 30 * delta;
        particle.rotation += particle.rotationVelocity * delta;

        context.save();
        context.globalAlpha = Math.max(0, 0.92 * (1 - progress));
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        const scale = 1 - progress * 0.32;
        context.scale(scale, scale);
        context.fillText(particle.letter, 0, 0);
        context.restore();
      }

      if (particles.length > 0) {
        particleFrame = window.requestAnimationFrame(renderParticles);
      }
    };

    const emitLetter = (
      x: number,
      y: number,
      pointerVelocityX: number,
      pointerVelocityY: number,
    ) => {
      const speed = Math.hypot(pointerVelocityX, pointerVelocityY);
      const travelAngle =
        speed > 0.2
          ? Math.atan2(-pointerVelocityY, -pointerVelocityX)
          : -Math.PI / 2;
      const angle = travelAngle + (Math.random() - 0.5) * 0.36;
      const velocity = 62 + Math.random() * 34;

      if (particles.length >= maximumParticles) particles.shift();
      particles.push({
        age: 0,
        letter: letters[letterIndex % letters.length],
        rotation: 0,
        rotationVelocity: (Math.random() - 0.5) * 0.5,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 12,
        x,
        y,
      });
      letterIndex += 1;

      if (!particleFrame) {
        lastParticleFrameTime = performance.now();
        particleFrame = window.requestAnimationFrame(renderParticles);
      }
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

    const handlePointerEnter = () => {
      cursor.classList.remove("is-hidden");
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) return;
      particles.length = 0;
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      if (particleFrame) {
        window.cancelAnimationFrame(particleFrame);
        particleFrame = 0;
      }
    };

    const heroResizeObserver =
      heroTitle && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleHeroBoundsRefresh)
        : null;

    resizeCanvas();
    heroResizeObserver?.observe(heroTitle!);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });
    window.addEventListener("resize", resizeCanvas);
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
      if (particleFrame) window.cancelAnimationFrame(particleFrame);
      if (boundsFrame) window.cancelAnimationFrame(boundsFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
      window.removeEventListener("resize", resizeCanvas);
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
      <canvas ref={canvasRef} className="cursor-particles" aria-hidden="true" />
      <div ref={cursorRef} className="cursor-emitter" aria-hidden="true">
        <span className="cursor-emitter__dot" />
      </div>
    </>
  );
}
