import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const contactLinks = [
  {
    id: "email",
    label: "Email",
    value: "samiam3d@gmail.com",
    href: "mailto:samiam3d@gmail.com",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/samiam3d",
    href: "https://www.linkedin.com/in/samiam3d",
  },
] as const;

function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      "[data-autofocus]",
    );
    focusable?.focus();

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="contact-modal-backdrop"
      role="presentation"
      aria-hidden={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="contact-modal"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="contact-modal__heading">
          <div>
            <p className="contact-modal__eyebrow">Let&apos;s make something</p>
            <h2 id="contact-modal-title">Contact</h2>
          </div>
          <button
            type="button"
            className="contact-modal__close"
            onClick={onClose}
            data-autofocus
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close contact dialog</span>
          </button>
        </div>
        <ul className="contact-modal__list">
          {contactLinks.map((item) => (
            <li key={item.id} className={`contact-modal__item contact-modal__item--${item.id}`}>
              <span>{item.label}</span>
              <a
                href={item.href}
                target={item.id === "linkedin" ? "_blank" : undefined}
                rel={item.id === "linkedin" ? "noopener noreferrer" : undefined}
              >
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

export function SiteHeader() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateBrandVisibility = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const hero = document.getElementById("hero");
        setShowBrand(Boolean(hero && hero.getBoundingClientRect().bottom <= 84));
      });
    };

    updateBrandVisibility();
    window.addEventListener("scroll", updateBrandVisibility, { passive: true });
    window.addEventListener("resize", updateBrandVisibility);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateBrandVisibility);
      window.removeEventListener("resize", updateBrandVisibility);
    };
  }, []);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a
          className={`site-nav__brand${showBrand ? " is-visible" : ""}`}
          href="#hero"
          aria-label="SamIam3D home"
          aria-hidden={!showBrand}
          tabIndex={showBrand ? 0 : -1}
        >
          samiam3D
        </a>
        <nav className="site-nav__links" aria-label="Primary navigation">
          <button
            type="button"
            className="site-nav__contact"
            onClick={() => setIsContactOpen(true)}
          >
            Contact
          </button>
        </nav>
        <ContactModal
          open={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </header>
  );
}
