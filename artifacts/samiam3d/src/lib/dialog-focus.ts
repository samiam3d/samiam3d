import type { RefObject } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function activateDialogFocus(
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const appRoot = document.getElementById("root");
  const previousOverflow = document.body.style.overflow;

  appRoot?.setAttribute("inert", "");
  document.body.style.overflow = "hidden";

  const focusFirst = () => {
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
    focusable?.[0]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => !element.hasAttribute("disabled"));
    if (!focusable.length) {
      event.preventDefault();
      panelRef.current.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.requestAnimationFrame(focusFirst);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    appRoot?.removeAttribute("inert");
    document.body.style.overflow = previousOverflow;
    previouslyFocused?.focus();
  };
}
