import { ProjectBrandMark } from "@/components/project-brand";
import {
  responsiveCreatorAsset,
  type CreatorProject,
  type CreatorProjectMedia,
} from "@/lib/creator-projects";

type ProjectVisualProps = {
  project: CreatorProject;
  context?: "card" | "modal";
};

type ProjectImageProps = {
  media: CreatorProjectMedia;
  className?: string;
  loading?: "eager" | "lazy";
  sizes: string;
};

function ProjectImage({
  media,
  className,
  loading = "lazy",
  sizes,
}: ProjectImageProps) {
  return (
    <img
      className={className}
      src={responsiveCreatorAsset(media.asset, 480)}
      srcSet={`${responsiveCreatorAsset(media.asset, 480)} 480w, ${responsiveCreatorAsset(media.asset, 1200)} 1200w`}
      sizes={sizes}
      width={media.width}
      height={media.height}
      loading={loading}
      decoding="async"
      alt={media.alt}
    />
  );
}

export function ProjectMark({
  project,
  decorative = true,
}: {
  project: CreatorProject;
  decorative?: boolean;
}) {
  return <ProjectBrandMark project={project} decorative={decorative} />;
}

function MindInkVisual({
  project,
  context,
}: {
  project: CreatorProject;
  context: "card" | "modal";
}) {
  const [studio, canvas, poster] = project.media;
  const loading = context === "modal" ? "eager" : "lazy";

  return (
    <div
      className={`project-visual project-visual--mindink project-visual--${context}`}
      role="group"
      aria-label="MindInk story posters and connected creation studio"
    >
      <div className="mindink-visual__halo" aria-hidden="true" />
      {studio && (
        <figure className="mindink-visual__frame mindink-visual__frame--studio">
          <ProjectImage
            media={studio}
            loading={loading}
            sizes={context === "modal" ? "55vw" : "70vw"}
          />
        </figure>
      )}
      {canvas && (
        <figure className="mindink-visual__frame mindink-visual__frame--canvas">
          <ProjectImage
            media={canvas}
            loading={loading}
            sizes={context === "modal" ? "40vw" : "48vw"}
          />
        </figure>
      )}
      {poster && (
        <figure className="mindink-visual__poster">
          <ProjectImage
            media={poster}
            loading={loading}
            sizes={context === "modal" ? "24vw" : "28vw"}
          />
        </figure>
      )}
      <div className="mindink-visual__caption" aria-hidden="true">
        <span>Story architecture</span>
        <span>Worlds</span>
        <span>Movie + sound</span>
        <span>Publishing</span>
      </div>
    </div>
  );
}

function VibeMindVisual({ context }: { context: "card" | "modal" }) {
  return (
    <div
      className={`project-visual project-visual--vibemind project-visual--${context}`}
    >
      <figure className="vibemind-visual__capture">
        <img
          src="/assets/showcase/vibemind-workspace.webp"
          alt="VibeMind private alpha demo workspace with the project conversation and build activity timeline"
          width={1440}
          height={900}
          loading={context === "modal" ? "eager" : "lazy"}
          decoding="async"
        />
        <figcaption className="vibemind-visual__caption">
          Private alpha · Demo workspace
        </figcaption>
      </figure>
    </div>
  );
}

function FlowerVisual({
  project,
  context,
}: {
  project: CreatorProject;
  context: "card" | "modal";
}) {
  return (
    <div
      className={`project-visual project-visual--flower project-visual--${context}`}
      role="img"
      aria-label="Flower Musica original flower identity"
    >
      <div className="flower-visual__identity" aria-hidden="true">
        <ProjectBrandMark
          project={project}
          className="flower-visual__authentic-mark"
        />
        <div className="flower-visual__name">
          Flower
          <br />
          Musica
        </div>
        <p className="flower-visual__discipline">Music. Culture. Creation.</p>
      </div>
    </div>
  );
}

function MediaVisual({
  project,
  context,
}: {
  project: CreatorProject;
  context: "card" | "modal";
}) {
  const primaryMedia = project.media[0];
  const secondaryMedia = context === "modal" ? project.media.slice(1, 3) : [];

  return (
    <div
      className={`project-visual project-visual--media project-visual--${context}`}
      aria-label={`${project.name} product visual`}
    >
      {primaryMedia ? (
        <ProjectImage
          media={primaryMedia}
          className={
            primaryMedia.crop ? `is-crop-${primaryMedia.crop}` : undefined
          }
          loading={context === "modal" ? "eager" : "lazy"}
          sizes={context === "modal" ? "55vw" : "52vw"}
        />
      ) : (
        <div className="project-visual__fallback">{project.name}</div>
      )}
      {project.id === "trendink" && (
        <span className="project-visual__trendink-eye">
          <ProjectBrandMark project={project} />
        </span>
      )}
      {secondaryMedia.length > 0 && (
        <div className="project-visual__secondary-media">
          {secondaryMedia.map((media, index) => (
            <figure key={`${media.asset}-${index}`}>
              <ProjectImage media={media} loading="lazy" sizes="24vw" />
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectVisual({
  project,
  context = "card",
}: ProjectVisualProps) {
  if (project.visual === "mindink") {
    return <MindInkVisual project={project} context={context} />;
  }

  if (project.visual === "vibemind") {
    return <VibeMindVisual context={context} />;
  }

  if (project.visual === "flower") {
    return <FlowerVisual project={project} context={context} />;
  }

  return <MediaVisual project={project} context={context} />;
}
