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
        <h1
          id="hero-title"
          className="hero__title"
          aria-label={title}
        >
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
      </div>
    </section>
  );
}
