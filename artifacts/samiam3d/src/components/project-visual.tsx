import { ProjectBrandMark } from "@/components/project-brand";
import type { CreatorProject } from "@/lib/creator-projects";
import {
  applicationViews,
  applicationViewSource,
} from "@/lib/application-visuals";

export function ProjectMark({
  project,
  decorative = true,
}: {
  project: CreatorProject;
  decorative?: boolean;
}) {
  return <ProjectBrandMark project={project} decorative={decorative} />;
}

export function ProjectVisual({
  project,
  context = "card",
}: {
  project: CreatorProject;
  context?: "card" | "modal";
}) {
  const view =
    project.id === "mindink" ? null : applicationViews[project.id][0];
  const src =
    project.id === "mindink"
      ? "/assets/showcase/mindink-v2/movie-creator.webp"
      : applicationViewSource(project.id, "hero");
  return (
    <figure className={`project-capture project-capture--${project.id}`}>
      <img
        src={src}
        width="1672"
        height="941"
        alt={
          view?.alt ??
          "MindInk Movie Creator product visualization with a cinematic preview and shot sequence"
        }
        loading={context === "modal" ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>
        {view?.label ?? "Movie Creator"} · Product visualization
      </figcaption>
    </figure>
  );
}
