import type { CSSProperties } from "react";
import "./project-divider.css";

const projectTones = {
  mindink: ["#090d18", "#538eff"],
  vibemind: ["#1b172a", "#bb9aff"],
  "flower-musica": ["#13150d", "#b6e66d"],
  hotclips: ["#0a141c", "#72d5e5"],
  trendink: ["#121315", "#c8cbd3"],
  clauseink: ["#eaf0f5", "#638aba"],
  mattel: ["#11171c", "#ed916d"],
  tales: ["#11171c", "#c4a4e6"],
  "ea-visceral": ["#11171c", "#9ebbd0"],
  bigpoint: ["#11171c", "#a6ba78"],
  "ruined-online": ["#11171c", "#d2a276"],
  "visual-concepts": ["#11171c", "#8ebed5"],
} as const;

type ProjectDividerProps = {
  from: string;
  to: string;
};

export function ProjectDivider({ from, to }: ProjectDividerProps) {
  const previous = projectTones[from as keyof typeof projectTones];
  const next = projectTones[to as keyof typeof projectTones];

  const style = {
    "--divider-from-field": previous?.[0] ?? "#11171c",
    "--divider-to-field": next?.[0] ?? "#11171c",
    "--divider-from": previous?.[1] ?? "#9ebbd0",
    "--divider-to": next?.[1] ?? "#9ebbd0",
  } as CSSProperties;

  return (
    <div className="project-divider" style={style} aria-hidden="true">
      <div className="project-divider__cut">
        <span className="project-divider__out" />
        <span className="project-divider__splice" />
        <span className="project-divider__in" />
      </div>
    </div>
  );
}
