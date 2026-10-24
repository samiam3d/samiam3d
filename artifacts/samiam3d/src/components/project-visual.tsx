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

function ProductCapture({
  project,
  context,
}: {
  project: CreatorProject;
  context: "card" | "modal";
}) {
  const capture = {
    mindink: {
      src: "/assets/showcase/mindink-v2/movie-creator.webp",
      width: 1672,
      height: 941,
      alt: "MindInk Movie Creator product visualization with a cinematic preview and shot sequence",
      caption: "Movie Creator · Product visualization",
    },
    "flower-musica": {
      src: "/assets/showcase/product-v2/flower-studio-session.webp",
      width: 1536,
      height: 864,
      alt: "A recording session in the Flower Musica studio",
      caption: "Inside Flower Musica",
    },
    hotclips: {
      src: "/assets/showcase/product-v2/hotclips-product-demo.webp",
      width: 1472,
      height: 684,
      alt: "HotClips public product demo with portrait video, selected clips and review controls",
      caption: "HotClips · Product demo",
    },
    trendink: {
      src: "/assets/showcase/product-v2/trendink-edit-studio.webp",
      width: 1536,
      height: 1024,
      alt: "TrendInk Edit Studio designed product view with a film preview and editing timeline",
      caption: "Edit Studio · Product design",
    },
  }[project.id as "mindink" | "flower-musica" | "hotclips" | "trendink"];
  return (
    <figure className={`project-capture project-capture--${project.id}`}>
      <img
        src={capture.src}
        width={capture.width}
        height={capture.height}
        alt={capture.alt}
        loading={context === "modal" ? "eager" : "lazy"}
        decoding="async"
      />
      <figcaption>{capture.caption}</figcaption>
    </figure>
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
  if (
    ["mindink", "flower-musica", "hotclips", "trendink"].includes(project.id)
  ) {
    return <ProductCapture project={project} context={context} />;
  }
  if (project.visual === "vibemind") {
    return <VibeMindVisual context={context} />;
  }
  return <MediaVisual project={project} context={context} />;
}
