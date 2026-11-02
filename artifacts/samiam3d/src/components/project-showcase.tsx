import { useState } from "react";
import { ApplicationGallery } from "@/components/application-gallery";
import { MindInkBanner, FlowerBanner, HotClipsBanner } from "@/components/project-banners-creative";
import { VibeMindBanner, TrendInkBanner, ClauseInkBanner } from "@/components/project-banners-tools";
import type { ProjectBannerProps as ShowcaseProps } from "@/components/project-banner-shared";
import { mindinkViews, mindinkViewSource } from "@/lib/mindink-showcase";

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
      <MindInkBanner {...props} />
      <div className="showcase-inner">
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
      <VibeMindBanner {...props} />
      <div className="showcase-inner">
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
      <FlowerBanner {...props} />
      <div className="showcase-inner">
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
      <HotClipsBanner {...props} />
      <div className="showcase-inner">
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
      <TrendInkBanner {...props} />
      <div className="showcase-inner">
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
      <ClauseInkBanner {...props} />
      <div className="showcase-inner">
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
