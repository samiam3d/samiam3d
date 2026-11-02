import "./builder-method.css";

const leadershipCapabilities = [
  "Creative vision", "World-building", "Art direction",
  "Team leadership", "Production systems", "Quality bar",
] as const;

const founderCapabilities = [
  "Product strategy", "UX/UI", "Brand systems", "Creative technology",
  "Technical implementation", "Launch",
] as const;

const methodSteps = [
  "Find the signal", "Define the world", "Build the system",
  "Align the team", "Ship the experience",
] as const;

function PracticeForm({ kind }: { kind: "vision" | "build" }) {
  return (
    <div className={`builder-method__form builder-method__form--${kind}`} aria-hidden="true">
      <span /><span /><span /><span />
    </div>
  );
}

export function BuilderMethod() {
  return (
    <section id="builder-method" className="builder-method" aria-labelledby="builder-method-title">
      <div className="builder-method__inner">
        <header className="builder-method__intro">
          <div>
            <p className="builder-method__eyebrow">One connected creative practice</p>
            <h2 id="builder-method-title">
              <span>I build from</span>{" "}
              <span>both sides</span>{" "}
              <span>of the table.</span>
            </h2>
          </div>
          <p>
            As a creative director, I shape the vision, world, visual language,
            team, and production system. As a founder, I carry those same
            responsibilities into product strategy, experience design,
            technology, and launch.
          </p>
        </header>

        <div className="builder-method__duality">
          <article className="builder-method__lane builder-method__lane--leadership">
            <PracticeForm kind="vision" />
            <div className="builder-method__lane-heading">
              <span className="builder-method__number" aria-hidden="true">01</span>
              <p>Creative leadership</p>
              <h3>Shape the vision.</h3>
            </div>
            <ul>
              {leadershipCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </article>

          <div className="builder-method__convergence" aria-hidden="true"><span /><span /></div>

          <article className="builder-method__lane builder-method__lane--founder">
            <PracticeForm kind="build" />
            <div className="builder-method__lane-heading">
              <span className="builder-method__number" aria-hidden="true">02</span>
              <p>Founder building</p>
              <h3>Make it real.</h3>
            </div>
            <ul>
              {founderCapabilities.map((capability) => <li key={capability}>{capability}</li>)}
            </ul>
          </article>
        </div>

        <ol className="builder-method__process" aria-label="Creative process">
          {methodSteps.map((step, index) => (
            <li className="builder-method__step" key={step}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
