import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  responsiveCreatorAsset,
  type CreatorProjectId,
} from "@/lib/creator-projects";

// ─── URL helpers ─────────────────────────────────────────────────────────────

// Story covers — pre-generated responsive webp from the original site migration
const storySrc = (stem: string, width: 480 | 1200) =>
  `/assets/responsive/2025/02/${stem}-${width}.webp`;

// UI captures from 2025/03 — PNG only, no responsive variants
const uiSrc = (filename: string) => `/assets/images/2025/03/${filename}`;

// ─── Content ─────────────────────────────────────────────────────────────────

// Six of the seven named story posters. "The Elite Five" is not in the
// repository — it should be added once the file is uploaded to the workspace.
const storyPosters = [
  {
    stem: "MidnightSpirits_cover_tall",
    title: "Midnight Spirits",
    width: 700,
    height: 1050,
  },
  {
    stem: "LightsInTheMist_cover_tall",
    title: "Lights in the Mist",
    width: 700,
    height: 1050,
  },
  {
    stem: "MascaraMurders_cover_tall",
    title: "Mascara Murders",
    width: 700,
    height: 1050,
  },
  {
    stem: "MirrorMirror_cover_tall",
    title: "Mirror Mirror",
    width: 700,
    height: 1050,
  },
  {
    stem: "ApexPredators_cover_tall-1",
    title: "Apex Predators",
    width: 700,
    height: 1050,
  },
] as const;

const proofItems = [
  {
    // Branch Canvas — existing responsive webp from creations folder
    src: responsiveCreatorAsset("mindink-story-canvas", 480),
    srcSet: `${responsiveCreatorAsset("mindink-story-canvas", 480)} 480w, ${responsiveCreatorAsset("mindink-story-canvas", 1200)} 1200w`,
    sizes: "(max-width: 640px) 90vw, (max-width: 900px) 45vw, 28vw",
    alt: "MindInk Branch Canvas — visual story architecture with connected narrative beats",
    width: 1400,
    height: 900,
    index: "01",
    label: "Branch Canvas",
    description:
      "Architect branching narratives visually. Connect beats, paths, and choices into living story structures.",
    portrait: false,
  },
  {
    // Scene Editor — 2025/03 UI capture (Story-Editor-Copy.png)
    src: uiSrc("Story-Editor-Copy.png"),
    srcSet: undefined as string | undefined,
    sizes: "(max-width: 640px) 90vw, (max-width: 900px) 45vw, 28vw",
    alt: "MindInk Scene Editor — cinematic creation studio with dialogue beats, sound, and mobile preview",
    width: 1024,
    height: 576,
    index: "02",
    label: "Scene Editor",
    description:
      "Direct cinematic scenes with tools for dialogue, action, sound, and visual direction.",
    portrait: false,
  },
  {
    // Stories home — 2025/03 UI capture (readers-storytelliing-remixed.png)
    src: uiSrc("readers-storytelliing-remixed.png"),
    srcSet: undefined as string | undefined,
    sizes: "(max-width: 640px) 60vw, (max-width: 900px) 30vw, 18vw",
    alt: "MindInk Stories — the reader app home showing published story worlds including Apex Predators",
    width: 500,
    height: 900,
    index: "03",
    label: "Stories",
    description:
      "Publish complete worlds — posters, trailers, branching stories — directly to readers.",
    portrait: true,
  },
] as const;

// ─── Orb ─────────────────────────────────────────────────────────────────────

function MindInkOrb() {
  return (
    <div className="mindink-orb" aria-hidden="true">
      <div className="mindink-orb__halo mindink-orb__halo--outer" />
      <div className="mindink-orb__halo mindink-orb__halo--mid" />
      <div className="mindink-orb__halo" />
      <img
        className="mindink-orb__image"
        src={responsiveCreatorAsset("mindink-icon", 480)}
        srcSet={`${responsiveCreatorAsset("mindink-icon", 480)} 480w, ${responsiveCreatorAsset("mindink-icon", 1200)} 1200w`}
        sizes="clamp(9rem, 15vw, 14rem)"
        width={700}
        height={700}
        alt=""
        decoding="async"
        loading="eager"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MindInkFlagship({
  onOpen,
}: {
  onOpen: (id: CreatorProjectId, trigger: HTMLButtonElement) => void;
}) {
  const ctaRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mindink-flagship">
      {/* ── Hero: orb + title ── */}
      <div className="mindink-flagship__inner">
        <div className="mindink-flagship__hero">
          <div className="mindink-flagship__orb-area">
            <MindInkOrb />
          </div>

          <div className="mindink-flagship__title-area">
            <p className="mindink-flagship__eyebrow">Flagship Venture</p>
            <h2 className="mindink-flagship__title">MindInk</h2>
            <p className="mindink-flagship__tagline">
              A complete creative studio for stories, worlds, movies, and
              publishing.
            </p>
            <button
              ref={ctaRef}
              className="mindink-flagship__cta"
              type="button"
              aria-haspopup="dialog"
              aria-label="View MindInk project details"
              onClick={() => {
                if (ctaRef.current) onOpen("mindink", ctaRef.current);
              }}
            >
              <span>Enter MindInk</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Story worlds label ── */}
        <div className="mindink-flagship__section-head" aria-hidden="true">
          <span>Story worlds</span>
        </div>

        {/* ── Story poster reel: 5 named portrait covers ── */}
        <div
          className="mindink-story-reel"
          role="group"
          aria-label="MindInk story world covers"
        >
          {storyPosters.map((poster, i) => (
            <figure
              key={poster.stem}
              className={`mindink-story-reel__poster mindink-story-reel__poster--${i + 1}`}
            >
              <img
                src={storySrc(poster.stem, 480)}
                srcSet={`${storySrc(poster.stem, 480)} 480w, ${storySrc(poster.stem, 1200)} 1200w`}
                sizes="(max-width: 640px) 42vw, (max-width: 900px) 22vw, 16vw"
                width={poster.width}
                height={poster.height}
                alt={`${poster.title} — a story world created in MindInk`}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mindink-story-reel__caption">
                {poster.title}
              </figcaption>
            </figure>
          ))}

          {/* Serious Weirdness — wide artwork, spans full reel width */}
          <figure className="mindink-story-reel__poster mindink-story-reel__wide">
            <img
              src={storySrc("SeriousWeirdness_cover_wide-1", 480)}
              srcSet={`${storySrc("SeriousWeirdness_cover_wide-1", 480)} 480w, ${storySrc("SeriousWeirdness_cover_wide-1", 1200)} 1200w`}
              sizes="(max-width: 640px) 90vw, 70vw"
              width={1200}
              height={450}
              alt="Serious Weirdness — wide artwork from a MindInk story world"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="mindink-story-reel__caption">
              Serious Weirdness
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ── Full-bleed cinematic worlds collage ── */}
      <div
        className="mindink-worlds"
        role="img"
        aria-label="MindInk characters and story worlds — a cinematic collage"
      >
        <img
          src={responsiveCreatorAsset("mindink-cosmic-hero", 480)}
          srcSet={`${responsiveCreatorAsset("mindink-cosmic-hero", 480)} 480w, ${responsiveCreatorAsset("mindink-cosmic-hero", 1200)} 1200w`}
          sizes="100vw"
          width={1920}
          height={1080}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* ── Product proof ── */}
      <div className="mindink-flagship__inner">
        <div className="mindink-flagship__section-head" aria-hidden="true">
          <span>The creation system</span>
        </div>

        <div className="mindink-proof" aria-label="MindInk creation tools">
          {proofItems.map((item) => (
            <div
              key={item.index}
              className={`mindink-proof__item${item.portrait ? " mindink-proof__item--portrait" : ""}`}
            >
              <figure className="mindink-proof__frame">
                <img
                  src={item.src}
                  {...(item.srcSet ? { srcSet: item.srcSet } : {})}
                  sizes={item.sizes}
                  width={item.width}
                  height={item.height}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <p className="mindink-proof__index">{item.index}</p>
              <p className="mindink-proof__label">{item.label}</p>
              <p className="mindink-proof__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
