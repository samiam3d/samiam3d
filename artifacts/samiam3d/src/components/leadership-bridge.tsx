const companies = ["Mattel", "Tales", "EA / Visceral", "Bigpoint", "2K"] as const;

export function LeadershipBridge() {
  return (
    <section
      id="leadership"
      className="leadership-bridge"
      aria-labelledby="leadership-bridge-title"
    >
      <div className="leadership-bridge__inner">
        <p className="leadership-bridge__eyebrow">
          Built independently. Proven at scale.
        </p>
        <div className="leadership-bridge__statement">
          <h2 id="leadership-bridge-title">
            The scale changed. The method did not.
          </h2>
          <div>
            <p>
              The ventures above are the founder-scale version of the work I
              have done throughout my career: turn ambiguity into a clear
              creative vision, build the system around it, align
              multidisciplinary teams, and carry the work through production.
            </p>
            <a href="#work">Explore leadership work</a>
          </div>
        </div>
        <ul className="leadership-bridge__companies" aria-label="Selected companies">
          {companies.map((company) => (
            <li key={company}>{company}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
