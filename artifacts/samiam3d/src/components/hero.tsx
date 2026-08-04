type HeroProps = {
  title?: string;
};

function HeroWordmark() {
  return (
    <>
      <span className="hero__wordmark-prefix">samiam3</span>
      <span className="hero__wordmark-d">D</span>
    </>
  );
}

export function Hero({ title = "samiam3D" }: HeroProps) {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__title" aria-label={title}>
          <span className="hero__layer hero__base" aria-hidden="true">
            <HeroWordmark />
          </span>
          <span className="hero__layer hero__face" aria-hidden="true">
            <HeroWordmark />
          </span>
          <span className="hero__paint-layer" aria-hidden="true" />
          <span className="hero__reveal" aria-hidden="true">
            <span className="hero__reveal-content">
              <span className="hero__layer hero__depth">
                <HeroWordmark />
              </span>
              <span className="hero__layer hero__sheen">
                <HeroWordmark />
              </span>
            </span>
          </span>
        </h1>

        <div className="hero__identity">
          <div className="hero__identity-title">
            <p>Sam Gutierrez</p>
            <strong>Creative Director · Founder · Product Builder</strong>
          </div>
          <p className="hero__identity-summary">
            I create worlds, products, and the systems that carry ambitious
            ideas from vision to launch.
          </p>
          <div className="hero__identity-actions">
            <a href="#creator-products">Explore ventures</a>
            <a href="#leadership">Leadership work</a>
          </div>
        </div>
      </div>
    </section>
  );
}
