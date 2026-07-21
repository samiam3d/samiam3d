type HeroProps = {
  title?: string;
  repeatLines?: number;
};

export function Hero({
  title = "samiam3d",
  repeatLines = 4,
}: HeroProps) {
  const lines = Array.from({ length: repeatLines }).map((_, index) => (
    <span key={index} className="hero__line">
      {title.toLocaleUpperCase()}
    </span>
  ));

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__title">
          {lines}
        </h1>
      </div>
    </section>
  );
}
