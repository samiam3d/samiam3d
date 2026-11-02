import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ProjectShowcase } from "@/components/project-showcase";
import { ProjectDivider } from "@/components/project-divider";
import { ProjectModal } from "@/components/project-modal";
import { ApplicationsIntro } from "@/components/applications-intro";
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
      <ApplicationsIntro />
      {creatorProjects.map((project, index) => (
        <Fragment key={project.id}>
          {index > 0 && (
            <ProjectDivider from={creatorProjects[index - 1].id} to={project.id} />
          )}
          <ProjectShowcase project={project} onOpen={openProject} />
        </Fragment>
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
