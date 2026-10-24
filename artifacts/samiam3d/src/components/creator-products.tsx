import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectModal } from "@/components/project-modal";
import { ProjectBrandMark } from "@/components/project-brand";
import {
  creatorProjects,
  getCreatorProject,
  isCreatorProjectId,
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

    const handlePopState = () => {
      setActiveProjectId(getProjectFromLocation());
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
    if (!activeProjectId) return;

    if (getHistoryState().creatorProjectLab) {
      window.history.back();
      return;
    }

    writeProjectHistory(null, "replace");
    setActiveProjectId(null);
  }, [activeProjectId, writeProjectHistory]);

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
      className="creator-showcase"
      aria-labelledby="creator-products-title"
    >
      <div className="creator-showcase__intro">
        <h2 id="creator-products-title">My own projects.</h2>
        <p>
          I make the worlds, the tools, and the brands around them. These are
          the ideas I’m building into something you can use.
        </p>
      </div>
      <nav className="creator-showcase__index" aria-label="Explore my projects">
        {creatorProjects.map((project) => (
          <a
            key={project.id}
            href={`#project-${project.id}`}
            aria-label={project.name}
          >
            <ProjectBrandMark project={project} />
            <span>{project.name}</span>
          </a>
        ))}
      </nav>
      {creatorProjects.map((project) => (
        <ProjectShowcase
          key={project.id}
          project={project}
          onOpen={openProject}
        />
      ))}

      <ProjectModal
        project={activeProject}
        onClose={closeProject}
        onNavigate={navigateProject}
        focusReturnRef={focusReturnRef}
      />
    </section>
  );
}
