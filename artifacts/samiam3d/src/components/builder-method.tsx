const leadershipCapabilities = [
  "Creative vision",
  "World-building",
  "Art direction",
  "Team leadership",
  "Production systems",
  "Quality bar",
] as const;

const founderCapabilities = [
  "Product strategy",
  "UX/UI",
  "Brand systems",
  "Creative technology",
  "Technical implementation",
  "Launch",
] as const;

const methodSteps = [
  "Find the signal",
  "Define the world",
  "Build the system",
  "Align the team",
  "Ship the experience",
] as const;

export function BuilderMethod() {
  return (
    <section
      id="builder-method"
      className="builder-method"
      aria-labelledby="builder-method-title"
    >
      <div className="builder-method__intro">
        <div>
          <p className="builder-method__eyebrow">One connected creative practice</p>
          <h2 id="builder-method-title">I build from both sides of the table.</h2>
        </div>
        <p>
          As a creative director, I shape the vision, world, visual language,
          team, and production system. As a founder, I carry those same
          responsibilities into product strategy, experience design,
          technology, and launch.
        </p>
      </div>

      <div className="builder-method__duality">
        <article className="builder-method__lane builder-method__lane--leadership">
          <div className="builder-method__lane-heading">
            <span>01</span>
            <div>
              <p>Creative leadership</p>
              <h3>Shape the vision.</h3>
            </div>
          </div>
          <ul>
            {leadershipCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </article>

        <div className="builder-method__convergence" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>

        <article className="builder-method__lane builder-method__lane--founder">
          <div className="builder-method__lane-heading">
            <span>02</span>
            <div>
              <p>Founder building</p>
              <h3>Make it real.</h3>
            </div>
          </div>
          <ul>
            {founderCapabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="builder-method__process" aria-label="Creative process">
        {methodSteps.map((step, index) => (
          <div className="builder-method__step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
