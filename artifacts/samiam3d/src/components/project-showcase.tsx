import { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectBrand } from "@/components/project-brand";
import {
  responsiveCreatorAsset,
  type CreatorProject,
  type CreatorProjectId,
} from "@/lib/creator-projects";

type ShowcaseProps = {
  project: CreatorProject;
  onOpen: (id: CreatorProjectId, trigger: HTMLButtonElement) => void;
};

function ProjectAction({ project, onOpen }: ShowcaseProps) {
  return (
    <button
      className="showcase-action"
      type="button"
      aria-haspopup="dialog"
      aria-label={`Explore the project: ${project.name}`}
      onClick={(event) => onOpen(project.id, event.currentTarget)}
    >
      Explore the project <Plus aria-hidden="true" size={18} />
    </button>
  );
}

function ProjectCopy({ project, onOpen }: ShowcaseProps) {
  return (
    <div className="showcase-copy">
      <h3 id={`showcase-${project.id}-title`}>{project.cardHeadline}</h3>
      <p>{project.cardDescription}</p>
      <ProjectAction project={project} onOpen={onOpen} />
    </div>
  );
}

function BrandHeader({
  project,
  tone = "light",
  note,
}: {
  project: CreatorProject;
  tone?: "light" | "dark";
  note: string;
}) {
  return (
    <div className="showcase-header">
      <ProjectBrand project={project} tone={tone} />
      <span className="showcase-discipline">{note}</span>
    </div>
  );
}

const storyCovers = [
  ["MidnightSpirits_cover_tall", "Midnight Spirits"],
  ["LightsInTheMist_cover_tall", "Lights in the Mist"],
  ["MascaraMurders_cover_tall", "Mascara Murders"],
  ["MirrorMirror_cover_tall", "Mirror Mirror"],
  ["ApexPredators_cover_tall-1", "Apex Predators"],
] as const;

const studioViews = [
  { id: "worlds", label: "Story worlds" },
  { id: "canvas", label: "Branch canvas" },
  { id: "editor", label: "Scene editor" },
] as const;

function MindInkShowcase(props: ShowcaseProps) {
  const [view, setView] =
    useState<(typeof studioViews)[number]["id"]>("worlds");
  return (
    <section
      className="project-showcase showcase-mindink"
      id="project-mindink"
      aria-labelledby="showcase-mindink-title"
    >
      <div className="showcase-mindink__scene" aria-hidden="true">
        <img
          src={responsiveCreatorAsset("mindink-cosmic-hero", 1200)}
          alt=""
          width="1920"
          height="1280"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          note="Stories, worlds & the tools to make them"
        />
        <div className="showcase-mindink__hero">
          <ProjectCopy {...props} />
          <p className="showcase-mindink__aside">
            A little imagination.
            <br />
            An entire universe.
          </p>
        </div>
        <div className="showcase-studio">
          <div
            className="showcase-studio__controls"
            aria-label="Explore MindInk"
          >
            <p>A look inside MindInk</p>
            <div
              className="showcase-studio__switcher"
              role="group"
              aria-label="MindInk views"
            >
              {studioViews.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={view === item.id}
                  aria-controls="mindink-view"
                  onClick={() => setView(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div
            className={`showcase-studio__view showcase-studio__view--${view}`}
            id="mindink-view"
            aria-label={studioViews.find((item) => item.id === view)?.label}
          >
            {view === "worlds" ? (
              <div
                className="showcase-posters"
                role="group"
                aria-label="MindInk story covers"
                tabIndex={0}
              >
                {storyCovers.map(([asset, title]) => (
                  <figure key={asset}>
                    <img
                      src={`/assets/responsive/2025/02/${asset}-480.webp`}
                      srcSet={`/assets/responsive/2025/02/${asset}-480.webp 480w, /assets/responsive/2025/02/${asset}-1200.webp 1200w`}
                      sizes="(max-width: 600px) 40vw, 18vw"
                      alt={`${title}, a MindInk story world`}
                      width="700"
                      height="1050"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>{title}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <figure className="showcase-studio__screen">
                <img
                  src={responsiveCreatorAsset(
                    view === "canvas"
                      ? "mindink-story-canvas"
                      : "mindink-studio",
                    1200,
                  )}
                  alt={
                    view === "canvas"
                      ? "MindInk's visual canvas connecting branching story paths"
                      : "MindInk scene editor with dialogue, narrative tools and a reader preview"
                  }
                  width={view === "canvas" ? 1400 : 1280}
                  height={view === "canvas" ? 900 : 720}
                  decoding="async"
                />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function VibeMindShowcase(props: ShowcaseProps) {
  return (
    <section
      className="project-showcase showcase-vibemind"
      id="project-vibemind"
      aria-labelledby="showcase-vibemind-title"
    >
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          note="An idea-to-app workspace / Private alpha"
        />
        <div className="showcase-vibemind__layout">
          <ProjectCopy {...props} />
          <figure className="showcase-vibemind__screen">
            <img
              src="/assets/showcase/vibemind-workspace.webp"
              alt="VibeMind private alpha demo workspace showing the project conversation and build activity timeline"
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <span>From the brief to the browser.</span>
              <span>Private alpha · Demo workspace</span>
            </figcaption>
          </figure>
        </div>
        <ol
          className="showcase-vibemind__process"
          aria-label="VibeMind workflow"
        >
          <li>Brief it.</li>
          <li>Shape it.</li>
          <li>Build it.</li>
          <li>Own it.</li>
        </ol>
      </div>
    </section>
  );
}

function FlowerShowcase(props: ShowcaseProps) {
  return (
    <section
      className="project-showcase showcase-flower"
      id="project-flower-musica"
      aria-labelledby="showcase-flower-musica-title"
    >
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          tone="dark"
          note="Music, identity & motion"
        />
        <div className="showcase-flower__layout">
          <div
            className="showcase-flower__art"
            role="img"
            aria-label="Flower Musica's original lightning-eyed flower identity"
          >
            <span className="showcase-flower__record" aria-hidden="true" />
            <img
              src="/assets/brands/flower-musica-mark.webp"
              alt=""
              width="800"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <span className="showcase-flower__sticker" aria-hidden="true">
              Made of
              <br />
              music.
            </span>
          </div>
          <ProjectCopy {...props} />
        </div>
        <div className="showcase-flower__footer">
          <span>Sound. Personality. A world of its own.</span>
          <span>Flower Musica</span>
        </div>
      </div>
    </section>
  );
}

function HotClipsShowcase(props: ShowcaseProps) {
  return (
    <section
      className="project-showcase showcase-hotclips"
      id="project-hotclips"
      aria-labelledby="showcase-hotclips-title"
    >
      <div className="showcase-inner">
        <BrandHeader project={props.project} note="Podcast to publish" />
        <div className="showcase-hotclips__heading">
          <ProjectCopy {...props} />
          <p className="showcase-hotclips__statement">
            Good conversations.
            <br />
            Great cuts.
          </p>
        </div>
        <div
          className="showcase-hotclips__edit"
          role="group"
          aria-label="HotClips podcast and clip framing brand artwork"
        >
          <figure className="showcase-hotclips__episode">
            <img
              src={responsiveCreatorAsset("hotclips-podcast-studio", 1200)}
              alt="HotClips brand artwork of two podcast hosts in conversation"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The conversation</figcaption>
          </figure>
          <div className="showcase-hotclips__cut" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <figure className="showcase-hotclips__moment">
            <img
              src={responsiveCreatorAsset("hotclips-podcast-studio", 1200)}
              alt="Portrait framing of a podcast host from the HotClips brand artwork"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The moment.</figcaption>
          </figure>
        </div>
        <p className="showcase-caption">
          Find the highlights. Make the cut. Keep the creative control.
        </p>
      </div>
    </section>
  );
}

function TrendInkShowcase(props: ShowcaseProps) {
  return (
    <section
      className="project-showcase showcase-trendink"
      id="project-trendink"
      aria-labelledby="showcase-trendink-title"
    >
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          note="Research into creative production"
        />
        <div className="showcase-trendink__layout">
          <ProjectCopy {...props} />
          <img
            className="showcase-trendink__aperture"
            src="/assets/brands/trendink-aperture.webp"
            alt="TrendInk's metallic aperture brand mark"
            width="720"
            height="720"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figure className="showcase-trendink__studio">
          <img
            src={responsiveCreatorAsset("trendink-hero-studio", 1200)}
            srcSet={`${responsiveCreatorAsset("trendink-hero-studio", 480)} 480w, ${responsiveCreatorAsset("trendink-hero-studio", 1200)} 1200w`}
            sizes="90vw"
            alt="TrendInk studio concept artwork connecting research signals, story planning and visual production"
            width="1920"
            height="1280"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span>Follow the idea all the way through.</span>
            <span>TrendInk brand & studio concept</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ClauseInkShowcase(props: ShowcaseProps) {
  return (
    <section
      className="project-showcase showcase-clauseink"
      id="project-clauseink"
      aria-labelledby="showcase-clauseink-title"
    >
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          tone="dark"
          note="A better place to work with words"
        />
        <div className="showcase-clauseink__layout">
          <ProjectCopy {...props} />
          <figure className="showcase-clauseink__document">
            <img
              src={responsiveCreatorAsset("clauseink-editor-live", 1200)}
              alt="ClauseInk's real contract editor with highlighted clauses and contextual review comments"
              width="2674"
              height="2014"
              loading="lazy"
              decoding="async"
            />
            <figcaption>The document. The review. All in one place.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function ProjectShowcase(props: ShowcaseProps) {
  switch (props.project.id) {
    case "mindink":
      return <MindInkShowcase {...props} />;
    case "vibemind":
      return <VibeMindShowcase {...props} />;
    case "flower-musica":
      return <FlowerShowcase {...props} />;
    case "hotclips":
      return <HotClipsShowcase {...props} />;
    case "trendink":
      return <TrendInkShowcase {...props} />;
    case "clauseink":
      return <ClauseInkShowcase {...props} />;
  }
}
