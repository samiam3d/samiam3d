import Image from "next/image";

const battlefield =
  "/assets/images/2025/02/2555467-battlefield-hardline-4-wm-1.jpg";
const hotWheels = "/assets/images/2025/04/Hotwheels-Party-scaled.png";
const barbie = "/assets/images/2025/04/Barbie-Royal_01-scaled.png";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">SAM GUTIERREZ / ART DIRECTOR</p>
          <h1 id="hero-title">Worlds worth playing.</h1>
          <p className="hero__summary">
            I direct game art and interactive experiences for Mattel, Tales,
            Battlefield, 2K, and original worlds.
          </p>
          <div className="hero__actions" aria-label="Portfolio actions">
            <a className="button button--primary" href="#work">
              View work
            </a>
            <a className="button button--secondary" href="#contact">
              Contact
            </a>
          </div>
        </div>

        <div className="hero__art" aria-label="Selected portfolio artwork">
          <figure className="hero-frame hero-frame--battlefield">
            <Image
              src={battlefield}
              alt="Battlefield Hardline key art showing a high-speed police pursuit"
              fill
              priority
              sizes="(max-width: 767px) 92vw, (max-width: 1199px) 58vw, 720px"
            />
          </figure>
          <figure className="hero-frame hero-frame--barbie">
            <Image
              src={barbie}
              alt="Barbie mobile game interface and environment art"
              fill
              sizes="(max-width: 767px) 40vw, 260px"
            />
          </figure>
          <figure className="hero-frame hero-frame--hotwheels">
            <Image
              src={hotWheels}
              alt="Hot Wheels character and vehicle customization interface"
              fill
              sizes="(max-width: 767px) 52vw, 430px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
