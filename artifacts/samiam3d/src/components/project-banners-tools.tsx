import { BannerBrand, BannerCopy, type ProjectBannerProps } from "./project-banner-shared";
import "./project-banners-tools.css";

export function VibeMindBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--vibemind">
      <div className="showcase-inner">
        <BannerBrand project={props.project} note="An idea-to-app workspace / Private alpha" />
        <div className="vibemind-banner__layout">
          <BannerCopy {...props} />
          <figure className="vibemind-banner__workbench">
            <div className="vibemind-banner__blueprint" aria-hidden="true" />
            <div className="vibemind-banner__preview">
              <img
                src="/assets/showcase/apps-v3/vibemind/hero.webp"
                alt="A product visualization of the Northstar project preview inside VibeMind"
                width="1672"
                height="941"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>Your idea. Your app. Your code.</span>
              <small>Product visualization</small>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

export function TrendInkBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--trendink">
      <img
        className="trendink-banner__art"
        src="/assets/responsive/creations/trendink-hero-studio-1200.webp"
        alt=""
        aria-hidden="true"
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
      />
      <div className="showcase-inner">
        <BannerBrand project={props.project} note="Research into creative production" />
        <div className="trendink-banner__story">
          <BannerCopy {...props} />
        </div>
        <div className="trendink-banner__signal" aria-label="TrendInk creative workflow">
          <span>Signal</span><i aria-hidden="true" /><span>Story</span><i aria-hidden="true" /><span>Production</span>
        </div>
      </div>
    </header>
  );
}

export function ClauseInkBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--clauseink">
      <div className="showcase-inner">
        <BannerBrand project={props.project} tone="dark" note="A better place to work with words" />
        <div className="clauseink-banner__layout">
          <BannerCopy {...props} />
          <figure className="clauseink-banner__papers">
            <div className="clauseink-banner__document">
              <img
                src="/assets/responsive/creations/clauseink-editor-live-1200.webp"
                alt="ClauseInk's actual document editor with highlighted clauses and contextual review comments"
                width="1200"
                height="904"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>Drafting &amp; review, on the same page.</figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
