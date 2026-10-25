import { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectBrand } from "@/components/project-brand";
import { ApplicationGallery } from "@/components/application-gallery";
import { mindinkViews, mindinkViewSource } from "@/lib/mindink-showcase";
import {
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

function MindInkShowcase(props: ShowcaseProps) {
  const [viewId, setViewId] =
    useState<(typeof mindinkViews)[number]["id"]>("branch-canvas");
  const view = mindinkViews.find((item) => item.id === viewId)!;
  return (
    <section
      className="project-showcase showcase-mindink"
      id="project-mindink"
      aria-labelledby="showcase-mindink-title"
    >
      <div className="showcase-inner">
        <BrandHeader
          project={props.project}
          note="The complete storytelling studio"
        />
        <div className="showcase-mindink__hero">
          <ProjectCopy {...props} />
          <p className="showcase-mindink__aside">
            Write it. Branch it.
            <br />
            Bring it to life.
          </p>
        </div>
        <div className="showcase-studio">
          <div className="showcase-studio__controls">
            <p>Inside the studio</p>
            <div
              className="showcase-studio__switcher"
              role="group"
              aria-label="MindInk views"
            >
              {mindinkViews.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={viewId === item.id}
                  aria-controls="mindink-view"
                  onClick={() => setViewId(item.id)}
                >
                  <span aria-hidden="true">0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <figure
            className="showcase-studio__view"
            id="mindink-view"
            aria-label={view.label}
          >
            <div className="showcase-studio__screen">
              <img
                key={view.id}
                src={mindinkViewSource(view.id)}
                alt={view.alt}
                width="1672"
                height="941"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="showcase-studio__caption">
              <div>
                <h4>{view.headline}</h4>
                <p>{view.description}</p>
              </div>
              <span>Product visualization</span>
            </figcaption>
          </figure>
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
          <p className="showcase-vibemind__note">
            Your idea.
            <br />
            Your app.
            <br />
            Your code.
          </p>
        </div>
        <ApplicationGallery projectId="vibemind" name={props.project.name} />
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
          note="Music, identity & a studio of its own"
        />
        <div className="showcase-flower__layout">
          <ProjectCopy {...props} />
          <img
            className="showcase-flower__identity"
            src="/assets/brands/flower-musica-mark.webp"
            alt="Flower Musica's original lightning-eyed flower identity"
            width="800"
            height="800"
            loading="lazy"
            decoding="async"
          />
        </div>
        <ApplicationGallery
          projectId="flower-musica"
          name={props.project.name}
        />
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
        <ApplicationGallery projectId="hotclips" name={props.project.name} />
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
        <ApplicationGallery projectId="trendink" name={props.project.name} />
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
        </div>
        <ApplicationGallery projectId="clauseink" name={props.project.name} />
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
