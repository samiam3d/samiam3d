"use client";

import { useEffect, useRef, useState } from "react";

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

  return (
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
      <div className="contact-modal" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <div className="contact-modal__heading">
          <h2 id="contact-modal-title">Contact</h2>
          <button
            type="button"
            className="contact-modal__close"
            onClick={onClose}
            data-autofocus
          >
            Close
          </button>
        </div>
        <ul className="contact-modal__list">
          {contactLinks.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target={item.id === "linkedin" ? "_blank" : undefined}
                rel={item.id === "linkedin" ? "noopener noreferrer" : undefined}
              >
                {item.label}: {item.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="/" aria-label="SamIam3D home">
          samiam3d
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
        <ContactModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
      </div>
    </header>
  );
}
