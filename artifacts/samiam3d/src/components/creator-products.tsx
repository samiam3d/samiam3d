import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectModal } from "@/components/project-modal";
import { TrendInkEye } from "@/components/trendink-eye";
import {
  creatorProjects,
  getCreatorProject,
  isCreatorProjectId,
  responsiveCreatorAsset,
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

function ProjectCard({
  project,
  onOpen,
}: {
  project: CreatorProject;
  onOpen: (projectId: CreatorProjectId, trigger: HTMLButtonElement) => void;
}) {
  const primaryMedia = project.media[0];

  return (
    <article className={`product-card product-card--${project.id}`}>
      <button
        className="product-card__button"
        type="button"
        aria-haspopup="dialog"
        aria-label={`View ${project.name} project details`}
        onClick={(event) => onOpen(project.id, event.currentTarget)}
      >
        <span className="product-card__media">
          <img
            src={responsiveCreatorAsset(primaryMedia.asset, 480)}
            srcSet={`${responsiveCreatorAsset(primaryMedia.asset, 480)} 480w, ${responsiveCreatorAsset(primaryMedia.asset, 1200)} 1200w`}
            sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 900px) calc(50vw - 2.25rem), 52vw"
            width={primaryMedia.width}
            height={primaryMedia.height}
            loading="lazy"
            decoding="async"
            alt={primaryMedia.alt}
          />
          {project.id === "trendink" && (
            <span className="product-card__trendink-eye">
              <TrendInkEye compact />
            </span>
          )}
        </span>

        <span className="product-card__content">
          <span className="product-card__identity">
            <span className="product-card__logo">
              <img
                src={responsiveCreatorAsset(project.logo.asset, 480)}
                srcSet={`${responsiveCreatorAsset(project.logo.asset, 480)} 480w, ${responsiveCreatorAsset(project.logo.asset, 1200)} 1200w`}
                sizes="64px"
                width={project.logo.width}
                height={project.logo.height}
                loading="lazy"
                decoding="async"
                alt=""
              />
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
        </span>
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

    const handlePopState = () => {
      setActiveProjectId(getProjectFromLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const openProject = useCallback(
    (projectId: CreatorProjectId, trigger: HTMLButtonElement) => {
      focusReturnRef.current = trigger;
      writeProjectHistory(projectId, "push");
      setActiveProjectId(projectId);
    },
    [writeProjectHistory],
  );

  const navigateProject = useCallback(
    (projectId: CreatorProjectId) => {
      writeProjectHistory(projectId, "replace");
      setActiveProjectId(projectId);
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

  const activeProject = getCreatorProject(activeProjectId);

  return (
    <section
      id="creator-products"
      className="product-lab"
      aria-labelledby="creator-products-title"
    >
      <div className="product-lab__intro">
        <div>
          <p className="product-lab__label">Independent Product Lab</p>
          <h2 id="creator-products-title">
            I build the products I wish existed.
          </h2>
        </div>
        <div className="product-lab__context">
          <p>
            Four independent products conceived, designed, and shipped end to
            end—across storytelling, legal workflows, creator intelligence, and
            media. Each began as a problem I couldn’t ignore and became working
            software you can open today.
          </p>
          <p className="product-lab__capabilities">
            Product strategy · UX/UI · AI systems · Full-stack build · Brand ·
            Launch
          </p>
        </div>
      </div>

      <div className="product-lab__grid">
        {creatorProjects.map((project) => (
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
