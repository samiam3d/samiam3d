import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { MindInkFlagship } from "@/components/mindink-flagship";
import { ProjectModal } from "@/components/project-modal";
import { ProjectMark, ProjectVisual } from "@/components/project-visual";
import {
  creatorProjects,
  getCreatorProject,
  isCreatorProjectId,
  type CreatorProject,
  type CreatorProjectId,
} from "@/lib/creator-projects";

type ProjectHistoryState = {
  creatorProjectLab?: boolean;
  creatorProjectId?: CreatorProjectId;
};

const getProjectFromLocation = (): CreatorProjectId | null => {
  const projectId = new URLSearchParams(window.location.search).get("project");
  return isCreatorProjectId(projectId) ? projectId : null;
};

const getProjectUrl = (projectId: CreatorProjectId | null) => {
  const url = new URL(window.location.href);

  if (projectId) {
    url.searchParams.set("project", projectId);
  } else {
    url.searchParams.delete("project");
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

const getHistoryState = (): ProjectHistoryState => {
  const state = window.history.state;
  return state && typeof state === "object" ? state : {};
};

// Projects shown in the grid — MindInk is presented as the flagship above.
const gridProjects = creatorProjects.filter((p) => p.id !== "mindink");

function ProjectCard({
  project,
  onOpen,
}: {
  project: CreatorProject;
  onOpen: (projectId: CreatorProjectId, trigger: HTMLButtonElement) => void;
}) {
  return (
    <article className={`product-card product-card--${project.id}`}>
      <button
        className="product-card__button"
        type="button"
        aria-haspopup="dialog"
        aria-label={`View ${project.name} project details`}
        onClick={(event) => onOpen(project.id, event.currentTarget)}
      >
        <div className="product-card__media">
          <ProjectVisual project={project} />
        </div>

        <div className="product-card__content">
          <span className="product-card__status">{project.status}</span>
          <span className="product-card__identity">
            <span className="product-card__logo">
              <ProjectMark project={project} />
            </span>
            <span className="product-card__name">{project.name}</span>
          </span>
          <span className="product-card__category">{project.category}</span>
          <span className="product-card__headline">{project.cardHeadline}</span>
          <span className="product-card__description">
            {project.cardDescription}
          </span>
          <span className="product-card__action">
            <span>View project</span>
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </button>
    </article>
  );
}

export function CreatorProducts() {
  const [activeProjectId, setActiveProjectId] =
    useState<CreatorProjectId | null>(null);
  const focusReturnRef = useRef<HTMLButtonElement | null>(null);

  const writeProjectHistory = useCallback(
    (projectId: CreatorProjectId | null, method: "push" | "replace") => {
      const nextState: ProjectHistoryState = {
        ...getHistoryState(),
        creatorProjectLab: Boolean(projectId),
        creatorProjectId: projectId ?? undefined,
      };
      window.history[`${method}State`](nextState, "", getProjectUrl(projectId));
    },
    [],
  );

  useEffect(() => {
    const directProject = getProjectFromLocation();

    if (directProject && !getHistoryState().creatorProjectLab) {
      const projectUrl = getProjectUrl(directProject);
      const baseState: ProjectHistoryState = {
        ...getHistoryState(),
        creatorProjectLab: false,
        creatorProjectId: undefined,
      };
      window.history.replaceState(baseState, "", getProjectUrl(null));
      window.history.pushState(
        {
          ...baseState,
          creatorProjectLab: true,
          creatorProjectId: directProject,
        },
        "",
        projectUrl,
      );
    }

    setActiveProjectId(directProject);

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as ProjectHistoryState | null;
      setActiveProjectId(
        state?.creatorProjectLab && state.creatorProjectId
          ? state.creatorProjectId
          : null,
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openProject = useCallback(
    (projectId: CreatorProjectId, trigger: HTMLButtonElement) => {
      focusReturnRef.current = trigger;
      setActiveProjectId(projectId);
      writeProjectHistory(projectId, "push");
    },
    [writeProjectHistory],
  );

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
    writeProjectHistory(null, "push");
  }, [writeProjectHistory]);

  const navigateProject = useCallback(
    (projectId: CreatorProjectId) => {
      setActiveProjectId(projectId);
      writeProjectHistory(projectId, "replace");
    },
    [writeProjectHistory],
  );

  const activeProject = getCreatorProject(activeProjectId);

  return (
    <section
      id="creator-products"
      className="product-lab"
      aria-labelledby="creator-products-title"
    >
      <div className="product-lab__intro">
        <div>
          <p className="product-lab__label">Founder-built ventures</p>
          <h2 id="creator-products-title">
            From first spark to working system.
          </h2>
        </div>
        <div className="product-lab__context">
          <p>
            I conceive, direct, design, and build products end to end—combining
            creative vision, narrative, brand, experience design, technical
            systems, and launch into one connected practice.
          </p>
          <p className="product-lab__capabilities">
            Product strategy · Creative direction · UX/UI · AI systems · Build ·
            Brand · Launch
          </p>
        </div>
      </div>

      {/* MindInk flagship — full-bleed, breaks out of the lab constraint */}
      <MindInkFlagship onOpen={openProject} />

      {/* Remaining ventures grid */}
      <div className="product-lab__grid product-lab__grid--flagship">
        {gridProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={openProject}
          />
        ))}
      </div>

      <ProjectModal
        project={activeProject}
        onClose={closeProject}
        onNavigate={navigateProject}
        focusReturnRef={focusReturnRef}
      />
    </section>
  );
}
