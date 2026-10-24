import type { CreatorProject } from "@/lib/creator-projects";

type ProjectBrandProps = {
  project: CreatorProject;
  className?: string;
  /** Foreground tone, chosen to contrast with the containing surface. */
  tone?: "light" | "dark";
  decorative?: boolean;
};

const brandAsset = (file: string) => `/assets/brands/${file}`;

/** Original project artwork. The Flower identity is its canonical alpha mask. */
export function ProjectBrandMark({
  project,
  className = "",
  tone = "light",
  decorative = true,
}: ProjectBrandProps) {
  const classes =
    `project-brand__mark project-brand__mark--${project.id} ${className}`.trim();

  if (project.id === "flower-musica") {
    return (
      <span
        className={classes}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : "Flower Musica flower mark"}
        aria-hidden={decorative ? true : undefined}
        style={{
          backgroundColor: "currentColor",
          mask: `url(${brandAsset("flower-musica-mark.webp")}) center / contain no-repeat`,
          WebkitMask: `url(${brandAsset("flower-musica-mark.webp")}) center / contain no-repeat`,
        }}
      />
    );
  }

  const source = {
    mindink: { file: "mindink-mark.webp", width: 144, height: 144 },
    vibemind: { file: "vibemind-mark.webp", width: 144, height: 144 },
    hotclips: { file: "hotclips-mark.webp", width: 144, height: 128 },
    trendink: { file: "trendink-icon.png", width: 256, height: 256 },
    clauseink: {
      file: `clauseink-wordmark-${tone}.png`,
      width: tone === "light" ? 512 : 1681,
      height: tone === "light" ? 79 : 258,
    },
  }[project.id];

  return (
    <img
      className={classes}
      src={brandAsset(source.file)}
      width={source.width}
      height={source.height}
      alt={decorative ? "" : `${project.name} logo`}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Complete identity: original wordmark where supplied, or the app's own lockup. */
export function ProjectBrand({
  project,
  className = "",
  tone = "light",
  decorative = false,
}: ProjectBrandProps) {
  const imageWordmark = project.id === "mindink" || project.id === "clauseink";

  return (
    <span
      className={`project-brand project-brand--${project.id} project-brand--${tone} ${className}`.trim()}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : project.name}
      aria-hidden={decorative ? true : undefined}
    >
      {imageWordmark ? (
        <img
          className="project-brand__wordmark project-brand__wordmark--image"
          src={brandAsset(
            project.id === "mindink"
              ? "mindink-wordmark.png"
              : `clauseink-wordmark-${tone}.png`,
          )}
          width={
            project.id === "mindink" ? 1581 : tone === "light" ? 512 : 1681
          }
          height={project.id === "mindink" ? 374 : tone === "light" ? 79 : 258}
          loading="lazy"
          decoding="async"
          alt=""
        />
      ) : (
        <>
          <ProjectBrandMark project={project} tone={tone} />
          <span className="project-brand__wordmark">
            {project.id === "vibemind" ? (
              <>
                <b>Vibe</b>
                <em>Mind</em>
              </>
            ) : (
              project.name
            )}
          </span>
        </>
      )}
    </span>
  );
}
