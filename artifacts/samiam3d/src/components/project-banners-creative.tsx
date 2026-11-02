import { ProjectBrandMark } from "./project-brand";
import { BannerBrand, BannerCopy, type ProjectBannerProps } from "./project-banner-shared";
import "./project-banners-creative.css";

const creation = (name: string, width: 480 | 1200) =>
  `/assets/responsive/creations/${name}-${width}.webp`;

const storyCovers = [
  { asset: "mindink-cover-electric-veins", title: "Electric Veins", width: 512, height: 713 },
  { asset: "mindink-world-cover", title: "Galactic Whiskerz", width: 1024, height: 1536 },
  { asset: "mindink-cover-night-match", title: "Night Match", width: 512, height: 696 },
] as const;

export function MindInkBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--mindink">
      <div className="showcase-inner">
        <BannerBrand project={props.project} note="The complete storytelling studio" />
        <div className="mindink-banner__stage">
          <BannerCopy {...props} />
          <div className="mindink-banner__worlds" aria-label="Stories created with MindInk">
            {storyCovers.map((cover) => (
              <figure className="mindink-banner__cover" key={cover.asset}>
                <img
                  src={creation(cover.asset, 480)}
                  srcSet={`${creation(cover.asset, 480)} 480w, ${creation(cover.asset, 1200)} 1200w`}
                  sizes="(max-width: 700px) 42vw, 22vw"
                  width={cover.width}
                  height={cover.height}
                  alt={`${cover.title} story cover from MindInk`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
            <p className="mindink-banner__signature">Write it. Branch it. Bring it to life.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function FlowerBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--flower">
      <div className="showcase-inner">
        <BannerBrand project={props.project} note="Music, identity & a studio of its own" />
        <div className="flower-banner__spread">
          <div className="flower-banner__identity" role="img" aria-label="Flower Musica's original lightning-eyed flower identity">
            <ProjectBrandMark project={props.project} />
          </div>
          <figure className="flower-banner__photograph">
            <img
              src="/assets/showcase/product-v2/flower-studio-session.webp"
              alt="A producer working at the console during a Flower Musica recording session"
              width={1536}
              height={864}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <BannerCopy {...props} />
      </div>
    </header>
  );
}

const waveform = [18, 28, 14, 40, 62, 36, 74, 48, 30, 58, 82, 46, 70, 36, 22, 54, 88, 65, 42, 78, 94, 58, 35, 66, 46, 26, 52, 70, 92, 62, 40, 76, 54, 32, 68, 88, 58, 38, 62, 44, 26, 50, 34, 20, 40, 28, 16];

export function HotClipsBanner(props: ProjectBannerProps) {
  return (
    <header className="project-banner project-banner--hotclips">
      <div className="showcase-inner">
        <BannerBrand project={props.project} note="Podcast to publish" />
        <div className="hotclips-banner__stage">
          <BannerCopy {...props} />
          <figure className="hotclips-banner__edit">
            <div className="hotclips-banner__source">
              <img
                src={creation("hotclips-podcast-studio", 1200)}
                srcSet={`${creation("hotclips-podcast-studio", 480)} 480w, ${creation("hotclips-podcast-studio", 1200)} 1200w`}
                sizes="(max-width: 700px) 88vw, 50vw"
                width={1200}
                height={675}
                alt="HotClips podcast brand artwork with two hosts in conversation"
                loading="lazy"
                decoding="async"
              />
              <div className="hotclips-banner__crop" aria-hidden="true"><span /><span /><span /><span /></div>
            </div>
            <div className="hotclips-banner__waveform" aria-hidden="true">
              {waveform.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              <span className="hotclips-banner__selection" />
            </div>
            <figcaption><span>Good conversations.</span><strong>Great cuts.</strong></figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}
