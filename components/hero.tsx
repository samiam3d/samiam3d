type HeroProps = {
  title?: string;
  repeatLines?: number;
};

export function Hero({ title = "samiam3d", repeatLines = 3 }: HeroProps) {
  const lines = Array.from({ length: Math.max(1, repeatLines) }, () => title);

  return (
    <section id="hero" className="hero hero--splash" aria-labelledby="hero-title">
      <div className="hero__inner">
        <h1 id="hero-title" className="hero__title">
          {lines.map((line, index) => (
            <span key={`${line}-${index}`} className="hero__line">
              {line.toUpperCase()}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
