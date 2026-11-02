import { Plus } from "lucide-react";
import { ProjectBrand } from "@/components/project-brand";
import type { CreatorProject, CreatorProjectId } from "@/lib/creator-projects";
import "./project-banner-shared.css";

export type ProjectBannerProps = {
  project: CreatorProject;
  onOpen: (id: CreatorProjectId, trigger: HTMLButtonElement) => void;
};

export function BannerBrand({
  project,
  note,
  tone = "light",
}: {
  project: CreatorProject;
  note: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="project-banner__brand">
      <ProjectBrand project={project} tone={tone} />
      <span className="project-banner__discipline">{note}</span>
    </div>
  );
}

export function BannerCopy({ project, onOpen }: ProjectBannerProps) {
  return (
    <div className="project-banner__copy">
      <h3 id={`showcase-${project.id}-title`}>{project.cardHeadline}</h3>
      <p>{project.cardDescription}</p>
      <button
        className="showcase-action"
        type="button"
        aria-haspopup="dialog"
        aria-label={`Explore the project: ${project.name}`}
        onClick={(event) => onOpen(project.id, event.currentTarget)}
      >
        Explore the project <Plus aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
