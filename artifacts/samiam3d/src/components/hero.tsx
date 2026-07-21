type HeroProps = {
  title?: string;
};

export function Hero({ title = "samiam3D" }: HeroProps) {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1
          id="hero-title"
          className="hero__title"
          aria-label={title}
        >
          <span className="hero__name">samiam3</span>
          <span className="hero__d">D</span>
          <span className="hero__sheen" aria-hidden="true">
            <span className="hero__name">samiam3</span>
            <span className="hero__d">D</span>
          </span>
        </h1>
      </div>
    </section>
  );
}
