import type { CSSProperties } from "react";
import { TrendInkEye } from "@/components/trendink-eye";
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
  if (project.logo) {
    return (
      <img
        src={responsiveCreatorAsset(project.logo.asset, 480)}
        srcSet={`${responsiveCreatorAsset(project.logo.asset, 480)} 480w, ${responsiveCreatorAsset(project.logo.asset, 1200)} 1200w`}
        sizes="120px"
        width={project.logo.width}
        height={project.logo.height}
        loading="lazy"
        decoding="async"
        alt={decorative ? "" : project.logo.alt}
      />
    );
  }

  return (
    <span
      className={`project-mark project-mark--${project.id}`}
      aria-hidden={decorative ? "true" : undefined}
    >
      {project.textMark ?? project.name.slice(0, 2).toUpperCase()}
    </span>
  );
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
  const stages = ["Brief", "Plan", "Build", "Preview"] as const;

  return (
    <div
      className={`project-visual project-visual--vibemind project-visual--${context}`}
      role="img"
      aria-label="VibeMind workflow moving from a product brief through planning and build into a healthy application preview"
    >
      <div className="vibemind-visual__topline">
        <span>VIBEMIND</span>
        <span>RUN 017</span>
        <span className="vibemind-visual__healthy">PREVIEW HEALTHY</span>
      </div>
      <div className="vibemind-visual__stages">
        {stages.map((stage, index) => (
          <div className="vibemind-visual__stage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="vibemind-visual__workspace">
        <div className="vibemind-visual__prompt">
          <span>PRODUCT BRIEF</span>
          <strong>
            Build a creator-first workspace that turns intent into owned software.
          </strong>
          <p>Plan approved. Changes remain visible, recoverable, and reviewable.</p>
        </div>
        <div className="vibemind-visual__preview">
          <div className="vibemind-visual__browserbar">
            <i />
            <i />
            <i />
            <span>preview.vibemind</span>
          </div>
          <div className="vibemind-visual__preview-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowerVisual({ context }: { context: "card" | "modal" }) {
  return (
    <div
      className={`project-visual project-visual--flower project-visual--${context}`}
      role="img"
      aria-label="Flower Musica lightning-eyed flower identity with a music waveform"
    >
      <div className="flower-visual__electric" aria-hidden="true" />
      <div className="flower-visual__mark" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            className="flower-visual__petal"
            key={index}
            style={
              {
                "--petal-angle": `${index * 45}deg`,
              } as CSSProperties
            }
          />
        ))}
        <span className="flower-visual__face">
          <i className="flower-visual__eye flower-visual__eye--left" />
          <i className="flower-visual__eye flower-visual__eye--right" />
          <i className="flower-visual__smile" />
        </span>
      </div>
      <div className="flower-visual__wordmark" aria-hidden="true">
        <strong>FLOWER</strong>
        <span>MUSICA</span>
      </div>
      <div className="flower-visual__waveform" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <i
            key={index}
            style={{ height: `${18 + (index % 7) * 9}%` }}
          />
        ))}
      </div>
      <div className="flower-visual__meta" aria-hidden="true">
        <span>PRODUCER</span>
        <span>PODCAST</span>
        <span>STUDIO</span>
        <span>CULTURE</span>
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
          className={primaryMedia.crop ? `is-crop-${primaryMedia.crop}` : undefined}
          loading={context === "modal" ? "eager" : "lazy"}
          sizes={context === "modal" ? "55vw" : "52vw"}
        />
      ) : (
        <div className="project-visual__fallback">{project.name}</div>
      )}
      {project.id === "trendink" && (
        <span className="project-visual__trendink-eye">
          <TrendInkEye compact />
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
    return <FlowerVisual context={context} />;
  }

  return <MediaVisual project={project} context={context} />;
}
