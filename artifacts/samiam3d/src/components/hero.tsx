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
          data-text={title}
        >
          <span className="hero__name">samiam3</span>
          <span className="hero__d">D</span>
        </h1>
      </div>
    </section>
  );
}
