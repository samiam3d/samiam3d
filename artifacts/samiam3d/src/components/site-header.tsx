import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

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

function ContactModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="contact-modal-backdrop" />
      <Dialog.Content className="contact-modal">
        <div className="contact-modal__heading">
          <div>
            <p className="contact-modal__eyebrow">Let&apos;s make something</p>
            <Dialog.Title id="contact-modal-title">Contact</Dialog.Title>
          </div>
          <Dialog.Close asChild>
            <button type="button" className="contact-modal__close">
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close contact dialog</span>
            </button>
          </Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">
          Contact Sam Gutierrez by email or LinkedIn.
        </Dialog.Description>
        <ul className="contact-modal__list">
          {contactLinks.map((item) => (
            <li
              key={item.id}
              className={`contact-modal__item contact-modal__item--${item.id}`}
            >
              <span>{item.label}</span>
              <a
                href={item.href}
                target={item.id === "linkedin" ? "_blank" : undefined}
                rel={
                  item.id === "linkedin" ? "noopener noreferrer" : undefined
                }
              >
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </Dialog.Content>
    </Dialog.Portal>
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
          <a href="#creator-products">Ventures</a>
          <a href="#leadership">Leadership</a>
          <Dialog.Root open={isContactOpen} onOpenChange={setIsContactOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="site-nav__contact">
                Contact
              </button>
            </Dialog.Trigger>
            <ContactModal />
          </Dialog.Root>
        </nav>
      </div>
    </header>
  );
}
