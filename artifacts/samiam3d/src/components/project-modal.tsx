import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProjectMark, ProjectVisual } from "@/components/project-visual";
import {
  creatorProjects,
  type CreatorProject,
  type CreatorProjectId,
} from "@/lib/creator-projects";

type ProjectModalProps = {
  project: CreatorProject | null;
  onClose: () => void;
  onNavigate: (id: CreatorProjectId) => void;
  focusReturnRef: MutableRefObject<HTMLButtonElement | null>;
};

function ProjectMediaGallery({ project }: { project: CreatorProject }) {
  return (
    <div
      className={`project-modal__media project-modal__media--${project.visual}`}
      aria-label={`${project.name} product visuals`}
    >
      <ProjectVisual project={project} context="modal" />
    </div>
  );
}

export function ProjectModal({
  project,
  onClose,
  onNavigate,
  focusReturnRef,
}: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const projectIndex = useMemo(
    () => creatorProjects.findIndex((item) => item.id === project?.id),
    [project?.id],
  );

  const previousProject =
    projectIndex >= 0
      ? creatorProjects[
          (projectIndex - 1 + creatorProjects.length) % creatorProjects.length
        ]
      : null;
  const nextProject =
    projectIndex >= 0
      ? creatorProjects[(projectIndex + 1) % creatorProjects.length]
      : null;

  useEffect(() => {
    if (!project) return;

    document.documentElement.classList.add("has-project-modal-open");
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.classList.remove("has-project-modal-open");
    };
  }, [project]);

  useEffect(() => {
    if (!project || !previousProject || !nextProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      if (event.key === "ArrowLeft") onNavigate(previousProject.id);
      if (event.key === "ArrowRight") onNavigate(nextProject.id);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextProject, onNavigate, previousProject, project]);

  return (
    <Dialog.Root
      open={Boolean(project)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {project && previousProject && nextProject && (
        <Dialog.Portal>
          <Dialog.Overlay className="project-modal-backdrop" />
          <Dialog.Content
            className={`project-modal project-modal--${project.id}`}
            onCloseAutoFocus={(event) => {
              const focusTarget = focusReturnRef.current;
              if (!focusTarget) return;

              event.preventDefault();
              window.requestAnimationFrame(() => focusTarget.focus());
            }}
          >
            <Dialog.Close asChild>
              <button
                className="project-modal__close"
                type="button"
                ref={closeButtonRef}
                aria-label={`Close ${project.name} project details`}
              >
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>

            <div className="project-modal__scroll">
              <div className="project-modal__layout">
                <ProjectMediaGallery project={project} />

                <div className="project-modal__content">
                  <div className="project-modal__brand">
                    <span className="project-modal__brand-mark">
                      <ProjectMark project={project} />
                    </span>
                    <span>{project.name}</span>
                  </div>
                  <p className="project-modal__category">{project.category}</p>
                  <Dialog.Title className="project-modal__title">
                    {project.modalHeadline}
                  </Dialog.Title>
                  <Dialog.Description className="project-modal__story">
                    {project.story}
                  </Dialog.Description>

                  <div className="project-modal__details">
                    <div>
                      <h3>What I built</h3>
                      <p>{project.whatIBuilt}</p>
                    </div>
                    <div>
                      <h3>My role</h3>
                      <p>{project.role}</p>
                    </div>
                  </div>

                  <div className="project-modal__footer">
                    <a
                      className="project-modal__cta"
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.ctaLabel}, opens ${project.name} in a new tab`}
                    >
                      <span>{project.ctaLabel}</span>
                      <ArrowUpRight aria-hidden="true" />
                    </a>

                    <nav
                      className="project-modal__navigation"
                      aria-label="Project navigation"
                    >
                      <button
                        type="button"
                        onClick={() => onNavigate(previousProject.id)}
                        aria-label={`Previous project, ${previousProject.name}`}
                      >
                        <ChevronLeft aria-hidden="true" />
                        <span>Previous</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate(nextProject.id)}
                        aria-label={`Next project, ${nextProject.name}`}
                      >
                        <span>Next</span>
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
