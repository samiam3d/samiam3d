const workIndex = [
  ["Mattel", "mattel"],
  ["Tales", "tales"],
  ["EA / Visceral", "ea-visceral"],
  ["Bigpoint", "bigpoint"],
  ["2K", "visual-concepts"],
] as const;

export function LeadershipBridge() {
  return (
    <div className="career-introduction">
      <div className="career-introduction__heading">
        <h2 id="leadership-work-title">From Hot Wheels<br />to Hardline.</h2>
        <p>Game worlds, interactive stories, and the teams behind them. Selected work from my career in art direction and production.</p>
      </div>
      <nav aria-label="Explore career work">
        {workIndex.map(([name, id]) => <a href={`#${id}`} key={id}>{name}</a>)}
      </nav>
    </div>
  );
}
